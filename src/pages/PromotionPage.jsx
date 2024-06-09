import React, { useState, useEffect } from 'react';
import { Table, Input, Spin, message, DatePicker, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { BreadCrumb } from '../components/BreadCrumb';
import promotionAPI from '../api/promotion';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '../hook/useDebounce';
import TextArea from 'antd/es/input/TextArea';
import 'dayjs/locale/vi';
import { Modal } from 'antd';
import { Form } from 'antd';
import { Select } from 'antd';
import { Flex } from 'antd';
import packageAPI from '../api/package';

const { RangePicker } = DatePicker;

export function PromotionPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchValue, setSearchValue] = useDebounce('', 500);
  const [form] = Form.useForm();
  const [promotion, setPromotion] = useState([]);
  const [promotionId, setPromotionId] = useState();
  const [promotionValue, setPromotionValue] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [packageDevice, setPackageDevices] = useState([]);
  const [discountSearch, setDiscountSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [isUpdateOpen, setIsUpdateOpen] = useState();
  const [listDevice, setListDevice] = useState([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const showDetailModal = () => {
    setIsDetailOpen(true);
  };
  const handleDetailOk = () => {
    setIsDetailOpen(false);
  };
  const handleDetailCancel = () => {
    setIsDetailOpen(false);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'InActive':
        return 'orange';
      case 'Expired':
        return 'red';
      default:
        return 'grey';
    }
  };

  const showUpdateModal = (id) => {
    if (id) {
      setPromotionId(id);
      mutatePromotionId(id);
    }
    setIsUpdateOpen(true);
  };
  const handeUpdateOk = () => {
    setIsUpdateOpen(false);
  };
  const handleUpdateCancel = () => {
    setIsUpdateOpen(false);
  };

  const { isPending: contractLoading, mutate: mutatePromotion } = useMutation({
    mutationFn: () => promotionAPI.getPromotion(),
    onSuccess: (response) => {
      setPromotion(response.data);
      setFilteredData(response.data);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get promotions list',
      });
    },
  });

  const { isPending: promotionIdLoading, mutate: mutatePromotionId } = useMutation({
    mutationFn: () => promotionAPI.getPromotionById(promotionId),
    onSuccess: (response) => {
      setPromotionValue(response);
      const newDeviceList = [];
      response?.devicePackages.forEach((item) => {
        newDeviceList.push(item.id);
      });
      setListDevice(newDeviceList);
      form.setFieldsValue({
        name: response?.name,
        discountAmount: response?.discountAmount,
        endDate: response?.endDate ? dayjs(response?.endDate, 'YYYY/MM/DD') : '',
        description: response?.description,
        status: response?.status,
        devicePackages: newDeviceList,
      });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    },
  });

  const onChangePackage = (value) => {
    setPackageList(value);
  };

  useEffect(() => {
    mutatePromotion();
  }, [searchValue]);

  const handleNameSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = promotion.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDiscountSearch = (e) => {
    const value = e.target.value;
    const filtered = promotion.filter((item) =>
      item.discountAmount.toString().includes(value)
    );
    setDiscountSearch(value);
    setFilteredData(filtered);
  };

  const { isPending: createPromotion, mutate: mutateCreatePromotion } = useMutation({
    mutationFn: (params) => promotionAPI.createPromotion(params),
    onSuccess: (response) => {
      messageApi.open({
        type: 'success',
        content: 'Tạo mã khuyến mãi thành công',
      });
      setIsDetailOpen(false);
    },
    onError: (response) => {
      messageApi.open({
        type: 'error',
        content: response.response.data.message,
      });
      setIsDetailOpen(false);
    },
  });

  const updatePromotionHandle = (response) => {
    const form = new FormData();
    form.append('name', response.name);
    form.append('discountAmount', parseInt(response.discountAmount));
    form.append('endDate', response.endDate.format('YYYY-MM-DD'));
    form.append('description', response.description);
    response.devicePackages.forEach((device) => {
      form.append('devicePackageIds', device);
    });
    mutateUpdate(form);
  };

  const { isPending: updateDevicePackageLoading, mutate: mutateUpdate } = useMutation({
    mutationFn: (params) => promotionAPI.updatePromotion(params, promotionId),
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Cập nhật thiết bị thành công',
      });
      setIsUpdateOpen(false);
    },
    onError: (response) => {
      messageApi.open({
        type: 'error',
        content: response.response.data.message,
      });
    },
  });

  const { isPending: deviceListLoading, mutate: mutatePackage } = useMutation({
    mutationFn: () => packageAPI.getPackageDevicesAll(),
    onSuccess: (response) => {
      const outputArray = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setPackageDevices(outputArray);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get products list',
      });
    },
  });

  const createDiscountHandler = (response) => {
    const form = new FormData();
    form.append('name', response.discountName);
    form.append('discountAmount', parseInt(response.discountValue));
    form.append('startDate', response.dateFirst.format('YYYY-MM-DD'));
    form.append('endDate', response.dateLater.format('YYYY-MM-DD'));
    form.append('description', response.description);
    packageList.forEach((packageItem) => {
      form.append('devicePackageIds', packageItem);
    });
    mutateCreatePromotion(form);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    const filtered = promotion.filter((item) => {
      const itemStartDate = dayjs(item.startDate);
      const itemEndDate = dayjs(item.endDate);
      return (
        (!start || itemStartDate.isAfter(start) || itemStartDate.isSame(start)) &&
        (!end || itemEndDate.isBefore(end) || itemEndDate.isSame(end))
      );
    });
    setDateRange(dates);
    setFilteredData(filtered);
  };

  useEffect(() => {
    mutatePromotion();
    mutatePackage();
  }, [createPromotion, updateDevicePackageLoading]);

  const columns = [
    {
      title: 'Tên mã',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: () => (
        <Input
          placeholder='Tìm kiếm tên mã'
          onChange={handleNameSearch}
          style={{ marginBottom: 8, display: 'block' }}
        />
      ),
      filterIcon: () => <Icon icon='material-symbols:search' />,
    },
    {
      title: 'Phần trăm giảm',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      filterDropdown: () => (
        <Input
          placeholder='Tìm kiếm phần trăm giảm'
          value={discountSearch}
          onChange={handleDiscountSearch}
          style={{ marginBottom: 8, display: 'block' }}
        />
      ),
      filterIcon: () => <Icon icon='material-symbols:search' />,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
      filterDropdown: () => (
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ marginBottom: 8, display: 'block' }}
          disabledDate={disabledDate}
        />
      ),
      filterIcon: () => <Icon icon='material-symbols:date-range' />,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
      filterDropdown: () => (
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ marginBottom: 8, display: 'block' }}
          disabledDate={disabledDate}
        />
      ),
      filterIcon: () => <Icon icon='material-symbols:date-range' />,
    },
    {
      title: 'Chi tiết',
      key: 'detail',
      render: (_, record) => (
        <Button type='link' onClick={() => showUpdateModal(record.id)}>
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        switch (status) {
          case 'Active':
            statusText = 'đang hoạt động';
            break;
          case 'InActive':
            statusText = 'chưa bắt đầu';
            break;
          case 'Expired':
            statusText = 'đã hết hạn';
            break;
          default:
            statusText = status;
        }
        return <span style={{ color: statusColor(status) }}>{statusText}</span>;
      },
    },
  ];

  return (
    <>
      <BreadCrumb />
      <Modal
        open={isDetailOpen}
        onOk={handleDetailOk}
        onCancel={handleDetailCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Thêm khuyến mãi</span>
        </div>
        <Form layout='vertical' onFinish={createDiscountHandler}>
          <div className='mb-[8px]'>
            <Form.Item label='Tên mã giảm giá' name='discountName'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Nhập mã'
              />
            </Form.Item>
          </div>

          <div className='mb-[8px]'>
            <Form.Item label='Phần trăm giảm' name='discountValue'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Nhập phần trăm giảm'
              />
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Ngày bắt đầu' name='dateFirst'>
              <DatePicker
                style={{
                  width: '100%',
                  marginBottom: '15px',
                }}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Ngày kết thúc' name='dateLater'>
              <DatePicker
                style={{
                  width: '100%',
                  marginBottom: '15px',
                }}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Mô tả' name='description'>
              <TextArea
                rows={4}
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Nhập mô tả'
              />
            </Form.Item>
          </div>
          <div className='mb-[8px]'>
            <Form.Item label='Chọn gói sản phẩm' name='package'>
              <Select
                mode='multiple'
                allowClear
                style={{
                  width: '100%',
                }}
                onChange={onChangePackage}
                options={packageDevice}
              />
            </Form.Item>
          </div>
          <Col span={24}>
            <Flex justify='end' gap={4}>
              <Button>Hủy</Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={createPromotion}
              >
                Thêm
              </Button>
            </Flex>
          </Col>
        </Form>
      </Modal>
      <Modal
        open={isUpdateOpen}
        onOk={handeUpdateOk}
        onCancel={handleUpdateCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Chỉnh sửa khuyến mãi</span>
        </div>
        <Spin tip='Loading...' spinning={promotionIdLoading}>
          <Form layout='vertical' form={form} onFinish={updatePromotionHandle}>
            <div className='mb-[8px]'>
              <Form.Item label='Tên mã giảm giá' name='name'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  placeholder='Nhập mã'
                />
              </Form.Item>
            </div>

            <div className='mb-[8px]'>
              <Form.Item label='Phần trăm giảm' name='discountAmount'>
                <Input
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  placeholder='Nhập phần trăm giảm'
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Ngày kết thúc' name='endDate'>
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Mô tả' name='description'>
                <TextArea
                  rows={4}
                  className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                  required
                  placeholder='Nhập mô tả'
                />
              </Form.Item>
            </div>
            <div className='mb-[8px]'>
              <Form.Item label='Gói sản phẩm' name='devicePackages'>
                <Select
                  mode='multiple'
                  allowClear
                  style={{
                    width: '100%',
                  }}
                  onChange={onChangePackage}
                  options={packageDevice}
                  value={listDevice}
                />
              </Form.Item>
            </div>
            <Col span={24}>
              <Flex justify='end' gap={4}>
                <Button onClick={() => handleUpdateCancel()}>Hủy</Button>
                <Button
                  type='primary'
                  htmlType='submit'
                >
                  Cập nhật
                </Button>
              </Flex>
            </Col>
          </Form>
        </Spin>
      </Modal>
      <div className='px-[24px] pt-[20px]'>
        {contextHolder}
        <Spin tip='Loading...' spinning={contractLoading}>
          <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
            <span className='flex items-center justify-between bg-[#0AB39C] px-[15px] py-[10px] rounded-[4px]'>
              <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
              <button
                onClick={showDetailModal}
                className='text-white font-poppin font-normal text-[13px] '
              >
                Thêm khuyến mãi
              </button>
            </span>
          </div>
          <div className='bg-[white] pt-[13px] pb-[16px]'>
            <div className='flex items-center justify-between px-[14px] mb-[15px]'>
              <span className='text-[#495057] font-poppin font-medium text-[16px]'>
                Danh sách mã khuyến mãi
              </span>
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey='id'
            />
          </div>
        </Spin>
      </div>
    </>
  );
}