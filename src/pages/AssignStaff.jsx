import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import surveyAPI from '../api/teller';
import tellerAPI from '../api/teller';
import dayjs from 'dayjs';
import user from '../../public/image/user.png';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  message,
  Table,
  Pagination,
  Row
} from 'antd';
import { Flex } from 'antd';
import { Space } from 'antd';
export function AssignStaff() {
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
    mutationFn: (params) => tellerAPI.createTeller(params),
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
      mutationFn: (params) => tellerAPI.updateTeller(params, tellerId),
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
    mutationFn: () => tellerAPI.getTellerList(),
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
      mutationFn: (tellerId) => tellerAPI.getTellerDetail(tellerId),
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
  const onUpdateTellerHander = (response) => {};
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
      item.fullName.toLowerCase().includes(value) ||
      item.phoneNumber.includes(value)
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
      dataIndex: 'fullName',
      key: 'fullName',
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
      title: 'Vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text) => (
        <div className='flex flex-col items-center'>
          <span className='font-poppin text-[14px] font-medium'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <div className='text-center'>
          <span className='font-poppin text-[14px] font-medium'>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Ngày đăng kí',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text) => (
        <div className='text-center'>
          <span className='font-poppin text-[14px] font-medium'>
            {dayjs(text).format('DD-MM-YYYY')}
          </span>
        </div>
      ),
    },
    {
      title: 'Xem chi tiết',
      key: 'detail',
      render: (text, record) => (
        <div className='flex justify-center cursor-pointer'>
          <Icon
            onClick={() => showDetailTellerHandler(record.accountId)}
            icon='material-symbols:border-color'
            width='20'
            height='20'
            style={{ color: '#b44b4b' }}
          />
        </div>
      ),
    },
    {
      title: 'Trạng thái nhân viên',
      key: 'status',
      render: (text, record) => (
        <div className='flex justify-center cursor-pointer'>
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
                  placeholder='Input fullname'
                  defaultValue={tellerDetail?.fullName}
                />
              </Form.Item>
            </div>
            <Col span={24}>
              <Space style={{ width: '100%', justifyContent: 'end' }}>
                <Button onClick={handleDetailTellerCancel}>Hủy</Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={updateTellerLoading}
                >
                  Thêm
                </Button>
              </Space>
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
            <Flex justify='end' gap={4}>
              <Button onClick={handleDetailCancel}>Hủy</Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={addTellerLoading}
              >
                Thêm
              </Button>
            </Flex>
          </Col>
        </Form>
      </Modal>

      <div className='px-[24px]'>
        <Spin tip='Loading...' spinning={tellerListLoading}>
          <div className='bg-[white] '>
          <Row justify='space-between' align='middle' style={{ marginBottom: '20px' }}>
              <Col>
                <Button
                  type='primary'
                  icon={<Icon icon='ic:baseline-plus' style={{ color: 'white' }} />}
                  onClick={showDetailModal}
                >
                  Thêm nhân viên
                </Button>
              </Col>
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

            <Pagination
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