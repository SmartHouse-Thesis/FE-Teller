import React, { useState, useEffect } from 'react';
import { Spin, message, Input, Table, Popconfirm, Pagination } from 'antd';
import { BreadCrumb } from '../components/BreadCrumb';
import packageAPI from '../api/package';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrentcy';
import { useDebounce } from '../hook/useDebounce';
import { Icon } from '@iconify/react';
export function PackagePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [packages, setPackageDevices] = useState({
    responses: [],
  });
  const [value, setValue] = useDebounce('', 500);
  const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
  const [smartId, setSmartId] = useState();

  const showPopconfirm = (accountId) => {
    setOpenPopUpConfirm(true);
  };

  const handleOkPopUpConfirm = (id) => {
    if (id) {
      setSmartId(id);

      mutateUpdate({
        id: id,
        status: 'InActive',
      });
    }
  };

  const handleCancelPopUpConfirm = () => {
    setOpenPopUpConfirm(false);
  };

  const { isPending: updateProductLoading, mutate: mutateUpdate } = useMutation({
    mutationFn: (params) => packageAPI.updateDevicePackage(params, smartId),
    onSuccess: (response) => {
      messageApi.open({
        type: 'success',
        content: 'Cập nhật thiết bị thành công',
      });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    },
  });

  const { isPending: deviceListLoading, mutate: mutatePackage } = useMutation({
    mutationFn: () => packageAPI.getPackageDevices(value),
    onSuccess: (response) => {
      setPackageDevices(response);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get products list',
      });
    },
  });

  useEffect(() => {
    mutatePackage(value);
  }, [value, updateProductLoading]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          to={`/package-page/update-package/${record.id}`}
          className='hover:text-blue-300 font-poppin text-[14px] font-medium text-[#495057]'
        >
          {text}
        </Link>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Tìm kiếm'
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => <Icon icon='carbon:search' />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Số ngày hoàn thành',
      dataIndex: 'completionTime',
      key: 'completionTime',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => formatCurrency(text),
    },
    {
      title: 'Ngừng kinh doanh',
      key: 'action',
      render: (text, record) => (
        <Popconfirm
          title='Ngừng kinh doanh'
          description='Bạn có muốn ngừng kinh doanh gói sản phẩm này không?'
          open={openPopupConfirm[record.id]}
          onConfirm={() => handleOkPopUpConfirm(record.id)}
          okButtonProps={{
            loading: updateProductLoading,
          }}
          onCancel={handleCancelPopUpConfirm}
        >
        <div className='flex justify-center'>
        <Icon
            key={record.id}
            onClick={(e) => {
              e.stopPropagation();
              showPopconfirm(record.id);
            }}
            icon='material-symbols:delete-forever-rounded'
            width='20'
            height='20'
            style={{ color: '#2f8e58', cursor: 'pointer' }}
          />
        </div>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <BreadCrumb />
      <div className='px-[24px] pt-[24px]'>
        <Spin tip='Loading...' spinning={deviceListLoading}>
        <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
              <span className='flex items-center justify-between bg-[#0AB39C]  px-[15px] py-[10px] rounded-[4px]'>
                <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
                <Link
                  to='/package-page/create-device'
                  className='text-white font-poppin font-normal text-[13px]'
                >
                  Thêm gói thiết bị
                </Link>
              </span>
            </div>
          <div className='bg-[white]  pt-[13px] pb-[16px] '>

            <div className='flex items-center justify-between px-[14px] mb-[15px]'>
              <span className='text-[#495057] font-poppin font-medium text-[16px]'>
                Danh sách gói sản phẩm
              </span>
            </div>
            <Table
              columns={columns}
              dataSource={packages?.data}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              rowKey='id'
              loading={deviceListLoading}
              onChange={handleTableChange}
            />
          </div>
        </Spin>
      </div>
    </>
  );
}