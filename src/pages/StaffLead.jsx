import { Icon } from '@iconify/react';
import user from '../../public/image/user.png';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
  message,
  Table,
  Row,
  Pagination as AntPagination
} from 'antd';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import staffAPI from '../api/staff';

export function StaffLead() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tellerId, setTellerId] = useState();
  const [survey, setSurvey] = useState({
    responses: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOpenTellerModal, setIsOpenTellerModal] = useState(false);
  const [addTellerSuccess, setAddTellerSuccess] = useState(false);
  const [tellerDetail, setTellerDetail] = useState();
  const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showPopconfirm = (accountId) => {
    setOpenPopUpConfirm(true);
  };

  const handleOkPopUpConfirm = (accountId) => {
    if (accountId) {
      setTellerId(accountId);
      mutateUpdateTeller({
        tellerId: accountId,
        status: 'InActive',
      });
    }
  };

  const handleCancelPopUpConfirm = () => {
    setOpenPopUpConfirm(false);
  };

  const showDetaiTellerlModal = () => {
    setIsOpenTellerModal(true);
  };

  const handleDetailTellerCancel = () => {
    setIsOpenTellerModal(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDetailModal = () => {
    setIsDetailOpen(true);
  };

  const handleDetailOk = () => {
    setIsDetailOpen(false);
  };

  const handleDetailCancel = () => {
    setIsDetailOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const { isPending: addTellerLoading, mutate: mutateAddTeller } = useMutation({
    mutationFn: (params) => staffAPI.createStaff(params),
    onSuccess: (response) => {
      messageApi.open({
        type: 'success',
        content: 'Thêm Teller thành công',
      });
      setAddTellerSuccess(true);
      setIsDetailOpen(false);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Thêm teller thất bại, vui lòng thử lại sau',
      });
    },
  });

  const { isPending: updateTellerLoading, mutate: mutateUpdateTeller } =
    useMutation({
      mutationFn: (params) => staffAPI.updateStaff(params, tellerId),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: response.message,
        });
        setNewPassword('');
        setPassword('');
        setAddTellerSuccess(true);
        setIsDetailOpen(false);
        setIsOpenTellerModal(false);
      },
      onError: (response) => {
        console.log(response);
        setNewPassword('');
        setPassword('');
        messageApi.open({
          type: 'error',
          content: response?.response.data.message,
        });
      },
    });

  const { isPending: tellerListLoading, mutate } = useMutation({
    mutationFn: () => staffAPI.getStaffLeaderList(),
    onSuccess: (response) => {
      setSurvey(response);
      setFilteredData(response.data);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Xảy ra lỗi khi get Teller List, vui lòng thử lại sau',
      });
    },
  });

  const { isPending: getTellerListLoading, mutate: mutateGetTellerDetail } =
    useMutation({
      mutationFn: (tellerId) => staffAPI.getStaffDetail(tellerId),
      onSuccess: (response) => {
        setTellerDetail(response);
        form.setFieldsValue({
          fullName: response.fullName,
          phoneNumber: response.phoneNumber,
          status: 'Active',
          password,
        });
      },
      onError: () => {
        messageApi.open({
          type: 'error',
          content: 'Error occur when get products list',
        });
      },
    });

  const onCreateTellerHandler = (response) => {
    mutateAddTeller(response);
    setAddTellerSuccess(false);
  };

  const onUpdateTellerHander = (response) => {
    // mutateUpdateTeller({
    //   tellerId: tellerId,
    //   fullName: response.fullName,
    //   status: 'Active',
    //   oldPassword: password,
    //   newPassword: newPassword,
    // });
  };

  const onHideTeller = (response) => {};

  useEffect(() => {
    mutate();
  }, [addTellerSuccess, updateTellerLoading]);

  const showDetailTellerHandler = (accountId) => {
    setIsOpenTellerModal(true);
    if (accountId) {
      setTellerId(accountId);
      mutateGetTellerDetail(accountId);
    }
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const newPassowrdChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = survey.data.filter(item =>
      item.leadFullName.toLowerCase().includes(value) ||
      item.leadEmail.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'leadFullName',
      key: 'leadFullName',
      render: (text, record) => (
        <div className='flex gap-[8px]  py-[12px] justify-start items-center'>
          {record.avatar ? (
            <img className='w-8 h-8 rounded-full' src={record.avatar} />
          ) : (
            <img src={user} className='w-8 h-8 rounded-full' />
          )}
          <div className='flex flex-col '>
            <span className='font-poppin text-[14px] font-medium text-[#495057]'>
              {text}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'leadEmail',
      key: 'leadEmail',
      render: (text) => (
        <div className=''>
          <span className='font-poppin text-[14px] font-medium'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Ẩn nhân viên',
      key: 'status',
      render: (text, record) => (
        <div className=''>
          <Popconfirm
            title='Ẩn nhân viên'
            description='Bạn có muốn ẩn nhân viên này không?'
            open={openPopupConfirm[record.accountId]}
            onConfirm={() => handleOkPopUpConfirm(record.accountId)}
            okButtonProps={{
              loading: updateTellerLoading,
            }}
            onCancel={handleCancelPopUpConfirm}
          >
            <Icon
              key={record.accountId}
              onClick={(e) => {
                e.stopPropagation();
                showPopconfirm(record.accountId);
              }}
              icon='material-symbols:delete-forever-rounded'
              width='20'
              height='20'
              style={{ color: '#2f8e58' }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Modal
        open={isOpenTellerModal}
        onCancel={handleDetailTellerCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Chọn nhân viên</span>
        </div>
        <Spin tip='Loading...' spinning={getTellerListLoading}>
          <Form
            form={form}
            initialValues={{
              password: password,
              fullName: tellerDetail?.fullName,
              status: 'Active',
            }}
            layout='vertical'
            onFinish={onUpdateTellerHander}
          >
            <div className='mb-[8px]'>
              <Form.Item label='Số điện thoại' name='phoneNumber'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  defaultValue={tellerDetail?.fullName}
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Họ và tên' name='fullName'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  placeholder='Input staff lead fullname'
                  defaultValue={tellerDetail?.fullName}
                />
              </Form.Item>
            </div>
            <Col span={24}>
              <Button onClick={handleDetailTellerCancel}>Hủy</Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={updateTellerLoading}
              >
                Thêm
              </Button>
            </Col>
          </Form>
        </Spin>
      </Modal>

      <Modal
        open={isDetailOpen}
        onCancel={handleDetailCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Chọn nhân viên</span>
        </div>
        <Form layout='vertical' onFinish={onCreateTellerHandler}>
          <div className='mb-[8px]'>
            <Form.Item label='Số điện thoại' name='phoneNumber'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Input phonenumber'
              ></Input>
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Mật khẩu' name='password'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                type='password'
                placeholder='Input password'
              ></Input>
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Họ và tên' name='fullName'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Input fullname'
              ></Input>
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Email' name='email'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Input email'
              ></Input>
            </Form.Item>
          </div>
          <Col span={24}>
            <Button onClick={handleDetailCancel}>Hủy</Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={addTellerLoading}
            >
              Thêm
            </Button>
          </Col>
        </Form>
      </Modal>

      <div className='px-[24px]'>
        <Spin tip='Loading...' spinning={tellerListLoading}>
          <div className='bg-[white] '>
            <Row justify='end' align='middle' style={{ marginBottom: '20px' }}>

              <Col>
                <Input
                  placeholder='Search...'
                  value={searchText}
                  onChange={handleSearch}
                  style={{ width: 200 }}
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              pagination={false}
              rowKey='accountId'
            />

            <AntPagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={handlePaginationChange}
              showSizeChanger
              onShowSizeChange={(current, size) => setPageSize(size)}
              style={{ textAlign: 'right', marginTop: 20 }}
            />
          </div>
        </Spin>
      </div>
    </>
  );
}