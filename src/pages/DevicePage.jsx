// import { Icon } from '@iconify/react';
// import productImg from '../../public/image/clother.png';
// import user from '../../public/image/user.png';
// import { Pagination } from '../components/Pagination';
// import { BreadCrumb } from '../components/BreadCrumb';
// import { SearchInput } from '../components/SearchInput';
// import devicesAPI from '../api/device';
// import { Popconfirm, Spin, message } from 'antd';
// import { useEffect, useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { Link, useParams } from 'react-router-dom';
// import { formatCurrency } from '../utils/formatCurrentcy';
// import { useDebounce } from '../hook/useDebounce';

// export function DevicePage() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [devices, setDevices] = useState({
//     responses: [],
//   });
//   const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
//   const [value, setValue] = useDebounce('', 500);
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [smartId, setSmartId] = useState();
//   const showPopconfirm = (accountId) => {
//     setOpenPopUpConfirm(true);
//   };
//   const handleOkPopUpConfirm = (id) => {
//     // console.log(accountId);
//     if (id) {
//       setSmartId(id);

//       mutateUpdate({
//         id: id,
//         // fullName: response.fullName,
//         status: 'InActive',
//         // oldPassword: password,
//         // newPassword: newPassword,
//       });
//     }

//     // setConfirmLoading(true);
//   };
//   const handleCancelPopUpConfirm = () => {
//     // console.log('Clicked cancel button');
//     setOpenPopUpConfirm(false);
//   };
//   const { isPending: updateProductLoading, mutate: mutateUpdate } = useMutation(
//     {
//       mutationFn: (params) => devicesAPI.updateSmartDevice(params, smartId),
//       onSuccess: (response) => {
//         messageApi.open({
//           type: 'success',
//           content: 'Cập nhật thiết bị thành công',
//         });
//       },
//       onError: () => {
//         messageApi.open({
//           type: 'error',
//           content: 'Error occur when get manufactures list',
//         });
//       },
//     }
//   );
//   const { isPending: deviceListLoading, mutate: mutateDevice } = useMutation({
//     mutationFn: () => devicesAPI.getSmartDeviceAll(value),
//     onSuccess: (response) => {
//       setDevices(response);
//     },
//     onError: () => {
//       messageApi.open({
//         type: 'error',
//         content: 'Error occur when get products list',
//       });
//     },
//   });
//   useEffect(() => {
//     mutateDevice(value);
//   }, [value, updateProductLoading]);

//   return (
//     <>
//       <BreadCrumb />
//       <div className='px-[24px] pt-[24px]'>
//         <Spin tip='Loading...' spinning={deviceListLoading}>
//           <div className='bg-[white]  pt-[13px] pb-[16px] '>
//             <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
//               <span className='flex items-center justify-between bg-[#0AB39C]  px-[15px] py-[10px] rounded-[4px]'>
//                 <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
//                 <Link
//                   to='/device-page/add-product'
//                   className='text-white font-poppin font-normal text-[13px]'
//                 >
//                   Thêm sản phẩm
//                 </Link>
//               </span>
//               <div className='flex items-center relative'>
//                 <Icon
//                   icon='material-symbols-light:search'
//                   style={{ color: '#9599AD' }}
//                   className='absolute left-[13px]'
//                 />
//                 <input
//                   onChange={(ev) => setValue(ev.target.value)}
//                   type='text'
//                   placeholder='Tìm kiếm...'
//                   className='font-poppin outline-none font-normal text-[13px] w-[300px] rounded-[4px] bg-[#F3F3F9] pt-[8px] pb-[10px] pl-[40px] pr-[10px]'
//                 />
//               </div>
//             </div>
//             <div className='flex items-center justify-between px-[14px] mb-[15px]'>
//               <span className='text-[#495057] font-poppin font-medium text-[16px]'>
//                 Danh sách sản phẩm
//               </span>
//             </div>
//             <table className='w-full'>
//               <tr className=''>
//                 <th className='w-[40%] pl-[20px] text-start font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Tên thiết bị
//                 </th>
//                 <th className='w-[20%] pl-[20px] text-start font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Loại thiết bị
//                 </th>
//                 <th className='w-[10%] pl-[20px] text-start font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Hãng
//                 </th>
//                 <th className='w-[10%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Giá
//                 </th>
//                 <th className='w-[10%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Xuất xứ
//                 </th>
//                 <th className='w-[10%] font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Ngừng kinh doanh
//                 </th>
//               </tr>

//               {devices?.data?.map((item) => (
//                 <tr className='border-t border-b border-[#E9EBEC] '>
//                   <td className=' gap-[8px] pl-[14px] py-[12px] flex  items-center '>
//                     <img
//                       src={item.images[0].url}
//                       className='w-[24px] h-[24px]'
//                     />
//                     <div className='flex flex-col'>
//                       <Link
//                         to={`/device-page/update-device/${item.id}`}
//                         className='hover:text-blue-300 font-poppin text-[14px] font-medium text-[#495057] '
//                       >
//                         {item.name}
//                       </Link>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-start'>
//                       <span className='font-poppin text-[14px] font-medium w-full'>
//                         {item.deviceType}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-start'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {item.manufacturer.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-start'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {formatCurrency(item.price)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className=' '>
//                       <span className='pl-[20px] text-center font-poppin text-[14px] font-medium'>
//                         {item.manufacturer.origin}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex justify-center cursor-pointer'>
//                       <Popconfirm
//                         title='Ngừng kinh doanh'
//                         description='Bạn có muốn ngừng kinh doanh sản phẩm này không?'
//                         open={openPopupConfirm[item.id]}
//                         onConfirm={() => handleOkPopUpConfirm(item.id)}
//                         okButtonProps={{
//                           loading: updateProductLoading,
//                         }}
//                         onCancel={handleCancelPopUpConfirm}
//                       >
//                         <Icon
//                           key={item.id}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             showPopconfirm(item.id);
//                           }}
//                           icon='material-symbols:delete-forever-rounded'
//                           width='20'
//                           height='20'
//                           style={{ color: '#2f8e58' }}
//                         />
//                       </Popconfirm>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </table>

//             <Pagination />
//           </div>
//         </Spin>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from 'react';
import {
  Spin,
  message,
  Input,
  Table,
  Popconfirm,
  Image,
  Pagination,
} from 'antd';
import { BreadCrumb } from '../components/BreadCrumb';
import devicesAPI from '../api/device';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrentcy';
import { useDebounce } from '../hook/useDebounce';
import { Icon } from '@iconify/react';

export function DevicePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
  const [devices, setDevices] = useState({
    responses: [],
  });
  const [value, setValue] = useDebounce('', 500);
  const [confirmLoading, setConfirmLoading] = useState(false);
    const [smartId, setSmartId] = useState();
  const showPopconfirm = (accountId) => {
    setOpenPopUpConfirm(true);
  };
  const { isPending: updateProductLoading, mutate: mutateUpdate } = useMutation(
    {
      mutationFn: (params) => devicesAPI.updateSmartDevice(params, smartId),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Ngừng kinh doanh thiết bị thành công',
        });
      },
      onError: (error) => {
        messageApi.open({
          type: 'error',
          content: error?.response.data.message,
        });
      },
    }
  );
  const { isPending: deviceListLoading, mutate: mutateDevice } = useMutation({
    mutationFn: () => devicesAPI.getSmartDeviceAll(value),
    onSuccess: (response) => {
      setDevices(response);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get products list',
      });
    },
  });

  useEffect(() => {
    mutateDevice(value);
  }, [value, updateProductLoading]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
  };

  const handleOkPopUpConfirm = (id) => {
    console.log(id);
    if (id) {
      setSmartId(id);

      mutateUpdate({
        id: id,
        status: 'InActive',
      });
    }
    setConfirmLoading(true);
  };

  const handleCancelPopUpConfirm = () => {
    setOpenPopUpConfirm(false);
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          to={`/device-page/update-device/${record.id}`}
          className='hover:text-blue-300 font-poppin text-[14px] font-medium text-[#495057]'
        >
          {text}
        </Link>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Tìm kiếm'
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => <Icon icon='carbon:search' />,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Loại thiết bị',
      dataIndex: 'deviceType',
      key: 'deviceType',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Tìm kiếm'
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => <Icon icon='carbon:search' />,
      onFilter: (value, record) =>
        record.deviceType.toLowerCase().includes(value.toLowerCase()),
    },
    // Thêm cột Hãng
    {
      title: 'Hãng',
      dataIndex: ['manufacturer', 'name'],
      key: 'manufacturer',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Tìm kiếm'
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => <Icon icon='carbon:search' />,
      onFilter: (value, record) =>
        record.manufacturer.name.toLowerCase().includes(value.toLowerCase()),
    },
    // Thêm cột Xuất xứ
    {
      title: 'Xuất xứ',
      dataIndex: ['manufacturer', 'origin'],
      key: 'origin',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder='Tìm kiếm'
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => <Icon icon='carbon:search' />,
      onFilter: (value, record) =>
        record.manufacturer.origin.toLowerCase().includes(value.toLowerCase()),
    },
    // Các cột khác
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => formatCurrency(text),
    },
    {
      title: 'Ngừng kinh doanh',
      dataIndex: 'id',
      key: 'action',

      render: (text, record) => (
        <Popconfirm
          title='Ngừng kinh doanh'
          description='Bạn có muốn ngừng kinh doanh sản phẩm này không?'
          open={openPopupConfirm[record.id]}
          onConfirm={() => handleOkPopUpConfirm(record.id)}
          okButtonProps={{
            loading: updateProductLoading,
          }}
          onCancel={handleCancelPopUpConfirm}
        >
          <Icon
            key={record.id}
            onClick={(e) => {
              e.stopPropagation();
              showPopconfirm(record.id);
            }}
            icon='material-symbols:delete-forever-rounded'
            width='20'
            height='20'
            style={{ color: '#2f8e58' }}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
    {contextHolder}
      <BreadCrumb />
      
      <div className='px-[24px] pt-[24px]'>

        <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
        <span className='flex items-center justify-between bg-[#0AB39C]  px-[15px] py-[10px] rounded-[4px]'>
                <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
                 <Link
                   to='/device-page/add-product'
                   className='text-white font-poppin font-normal text-[13px]'
                 >
                   Thêm sản phẩm
                 </Link>
               </span>

            </div>
        <Spin tip='Loading...' spinning={deviceListLoading}>
          <div className='bg-white pt-[13px] pb-[16px]'>

          <div className='flex items-center justify-between px-[14px] mb-[15px]'>
              <span className='text-[#495057] font-poppin font-medium text-[16px]'>
                Danh sách thiết bị
              </span>
            </div>
            <Table
              columns={columns}
              dataSource={devices?.data}
              pagination={{ pageSize: 10 }}
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
