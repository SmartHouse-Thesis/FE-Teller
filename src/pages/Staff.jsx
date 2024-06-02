import { Icon } from '@iconify/react';
import user from '../../public/image/user.png';
import { Pagination } from '../components/Pagination';
import { BreadCrumb } from '../components/BreadCrumb';
import { SearchInput } from '../components/SearchInput';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Switch,
  message,
  Table,
  Row,
  Space,
  Pagination as AntPagination
} from 'antd';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import staffAPI from '../api/staff';
import dayjs from 'dayjs';

export function Staff() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [staffId, setStaffId] = useState();
  const [survey, setSurvey] = useState({
    responses: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOpenStaffModal, setIsOpenStaffModal] = useState(false);
  const [addStaffSuccess, setAddStaffSuccess] = useState(false);
  const [staffDetail, setStaffDetail] = useState();
  const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showPopconfirm = (accountId) => {
    setOpenPopUpConfirm(true);
  };
  const handleOkPopUpConfirm = (accountId) => {
    if (accountId) {
      setStaffId(accountId);

      mutateUpdateStaff({
        staffId: accountId,
        status: 'InActive',
      });
    }
  };
  const staffLeaderChange = (checked) => {
    setChecked(checked);
  };
  const handleCancelPopUpConfirm = () => {
    setOpenPopUpConfirm(false);
  };
  const showDetaiTellerlModal = () => {
    setIsOpenStaffModal(true);
  };
  const handleDetailTellerCancel = () => {
    setIsOpenStaffModal(false);
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
  const { isPending: addStaffLoading, mutate: mutateAddStaff } = useMutation({
    mutationFn: (params) => staffAPI.createStaff(params),
    onSuccess: (response) => {
      messageApi.open({
        type: 'success',
        content: 'Thêm Staff thành công',
      });
      setAddStaffSuccess(true);
      setIsDetailOpen(false);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Thêm staff thất bại, vui lòng thử lại sau',
      });
    },
  });
  const { isPending: updateStaffLoading, mutate: mutateUpdateStaff } =
    useMutation({
      mutationFn: (params) => staffAPI.updateStaff(params, staffId),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Cập nhật staff thành công',
        });
        setNewPassword('');
        setPassword('');
        setAddStaffSuccess(true);
        setIsDetailOpen(false);
        setIsOpenStaffModal(false);
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
    mutationFn: () => staffAPI.getStaffList(),
    onSuccess: (response) => {
      setSurvey(response);
      setFilteredData(response.data);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Xảy ra lỗi khi get Staff List, vui lòng thử lại sau',
      });
    },
  });
  const { isPending: getTellerListLoading, mutate: mutateGetstaffDetail } =
    useMutation({
      mutationFn: (staffId) => staffAPI.getStaffDetail(staffId),
      onSuccess: (response) => {
        setStaffDetail(response);

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
          content: 'Error occur when get staff detail',
        });
      },
    });
  const onCreateStaffHandle = (response) => {
    mutateAddStaff({
      phoneNumber: response.phoneNumber,
      password: response.password,
      fullName: response.fullName,
      email: response.email,
      isLead: false,
    });
    setAddStaffSuccess(false);
  };
  const updateStaffHandler = (response) => {
    mutateUpdateStaff({
      staffId: staffId,
      fullName: response.fullName,
      status: 'Active',
      isLead: checked,
    });
  };
  const onHideTeller = (response) => {};
  useEffect(() => {
    mutate();
  }, [addStaffSuccess, updateStaffLoading]);
  const showDetailTellerHandler = (accountId) => {
    setIsOpenStaffModal(true);
    if (accountId) {
      setStaffId(accountId);
      mutateGetstaffDetail(accountId);
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
              loading: updateStaffLoading,
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
        open={isOpenStaffModal}
        onCancel={handleDetailTellerCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Gán nhân viên thành leader</span>
        </div>
        <Spin tip='Loading...' spinning={getTellerListLoading}>
          <Form
            form={form}
            initialValues={{
              password: password,
              fullName: staffDetail?.fullName,
              status: 'Active',
            }}
            layout='vertical'
            onFinish={updateStaffHandler}
          >
            <div className='mb-[8px]'>
              <Form.Item label='Số điện thoại' name='phoneNumber'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  defaultValue={staffDetail?.fullName}
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Họ và tên' name='fullName'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  placeholder='Input fullname'
                  defaultValue={staffDetail?.fullName}
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Gán staff thành leader' name='staffLeader'>
                <Switch defaultChecked={false} onChange={staffLeaderChange} />
              </Form.Item>
            </div>

            <Col span={24}>
              <Space style={{ width: '100%', justifyContent: 'end' }}>
                <Button onClick={handleDetailTellerCancel}>Hủy</Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={updateStaffLoading}
                >
                  Ok
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
        <Form layout='vertical' onFinish={onCreateStaffHandle}>
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
            <Space style={{ width: '100%', justifyContent: 'end' }}>
              <Button onClick={handleDetailCancel}>Hủy</Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={addStaffLoading}
              >
                Thêm
              </Button>
            </Space>
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