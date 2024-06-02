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
  //   const [packageDevice, setPackageDevices] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
    const [packageList, setPackageList] = useState([]);
    const [packageDevice, setPackageDevices] = useState([]);
  const [discountSearch, setDiscountSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
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
  const { isPending: contractLoading, mutate: mutatePromotion } = useMutation({
    mutationFn: () => promotionAPI.getPromotion(searchValue),
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
    const { isPending: createPromotion, mutate: mutateCreatePromotion } =
    useMutation({
      mutationFn: (params) => promotionAPI.createPromotion(params),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Tạo mã khuyến mãi thành công',
        });
        setIsDetailOpen(false);
        // setPromotion(response);
      },
      onError: (response) => {
        console.log(response);
        messageApi.open({
          type: 'error',
          content: response.response.data.message,
        });
        setIsDetailOpen(false);
      },
    });
      const { isPending: deviceListLoading, mutate: mutatePackage } = useMutation({
    mutationFn: () => packageAPI.getPackageDevicesAll(),
    onSuccess: (response) => {
      const outputArray = [];

      response.data.forEach((item) => {
        outputArray.push({
          label: item.name,
          value: item.id,
        });
      });
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
    console.log(response);
    const form = new FormData();
    form.append('name', response.discountName);
    form.append('discountAmount', parseInt(response.discountValue));
    form.append('startDate', response.dateFirst.format('YYYY-MM-DD'));
    form.append('endDate', response.dateLater.format('YYYY-MM-DD'));
    form.append('description', response.description);
    for (const packageItem of packageList) {
      form.append('devicePackageIds', packageItem);
    }
    mutateCreatePromotion(form);
  };
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    const filtered = promotion.filter((item) => {
      const itemStartDate = dayjs(item.startDate);
      const itemEndDate = dayjs(item.endDate);
      return (
        (!start ||
          itemStartDate.isAfter(start) ||
          itemStartDate.isSame(start)) &&
        (!end || itemEndDate.isBefore(end) || itemEndDate.isSame(end))
      );
    });
    setDateRange(dates);
    setFilteredData(filtered);
  };
  useEffect(() => {
    mutatePromotion();
    mutatePackage();
  }, [createPromotion]);
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
        />
      ),
      filterIcon: () => <Icon icon='material-symbols:date-range' />,
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
        <Form
          // form={form}
          // initialValues={{
          //   password: password,
          //   fullName: tellerDetail?.fullName,
          //   status: 'Active',
          // }}

          // 'checkbox-group': ['A', 'B'],
          // rate: 3.5,
          // 'color-picker': null,
          layout='vertical'
          onFinish={createDiscountHandler}
        >
          <div className='mb-[8px]'>
            <Form.Item label='Tên mã giảm giá' name='discountName'>
              <Input
                className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                required
                placeholder='Nhập mã'
              />
              {/* <span>{tellerDetail?.phoneNumber}</span> */}
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
                value={
                  dayjs()
                  // dayjs(surveyDetail?.surveyDate).format('YYYY-MM-DD'),
                  // 'YYYY-MM-DD'
                }
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
                value={
                  dayjs()
                  // dayjs(surveyDetail?.surveyDate).format('YYYY-MM-DD'),
                  // 'YYYY-MM-DD'
                }
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
        {/* <div className='flex justify-end gap-[8px] mt-[20px]'>
  <button className='rounded-[4px] text-white py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#3fc055]'>
    Xác nhận
  </button>
  <button className='button__close rounded-[4px] text-[#dedbdb] py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#ec5b27]'>
    Hủy bỏ
  </button>
</div> */}
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

// import { Icon } from '@iconify/react';
// import productImg from '../../public/image/clother.png';
// import user from '../../public/image/user.png';
// import { Pagination } from '../components/Pagination';
// import { BreadCrumb } from '../components/BreadCrumb';
// import { SearchInput } from '../components/SearchInput';

// import {
//   Button,
//   Col,
//   DatePicker,
//   Flex,
//   Form,
//   Input,
//   Modal,
//   Select,
//   Spin,
//   message,
// } from 'antd';
// import { useEffect, useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import packageAPI from '../api/package';
// import contractAPI from '../api/contract';
// import { Link } from 'react-router-dom';
// import promotionAPI from '../api/promotion';
// import dayjs from 'dayjs';
// import TextArea from 'antd/es/input/TextArea';
// import { useDebounce } from '../hook/useDebounce';

// export function PromotionPage() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [packageDevice, setPackageDevices] = useState([]);
//   const [value, setValue] = useDebounce('', 500);
//   const [packageList, setPackageList] = useState([]);
//   const [promotion, setPromotion] = useState({
//     responses: [],
//   });
//   const [isDetailOpen, setIsDetailOpen] = useState(false);

//   const showDetailModal = () => {
//     setIsDetailOpen(true);
//   };
//   const handleDetailOk = () => {
//     setIsDetailOpen(false);
//   };
//   const handleDetailCancel = () => {
//     setIsDetailOpen(false);
//   };
//   const { isPending: contractLoading, mutate: mutatePromotion } = useMutation({
//     mutationFn: () => promotionAPI.getPromotion(),
//     onSuccess: (response) => {
//       setPromotion(response);
//     },
//     onError: () => {
//       messageApi.open({
//         type: 'error',
//         content: 'Error occur when get products list',
//       });
//     },
//   });
//   const { isPending: deviceListLoading, mutate: mutatePackage } = useMutation({
//     mutationFn: () => packageAPI.getPackageDevicesAll(),
//     onSuccess: (response) => {
//       const outputArray = [];

//       response.data.forEach((item) => {
//         outputArray.push({
//           label: item.name,
//           value: item.id,
//         });
//       });
//       setPackageDevices(outputArray);
//     },
//     onError: () => {
//       messageApi.open({
//         type: 'error',
//         content: 'Error occur when get products list',
//       });
//     },
//   });
//   const { isPending: createPromotion, mutate: mutateCreatePromotion } =
//     useMutation({
//       mutationFn: (params) => promotionAPI.createPromotion(params),
//       onSuccess: (response) => {
//         messageApi.open({
//           type: 'success',
//           content: 'Tạo mã giảm giá thành công',
//         });
//         setIsDetailOpen(false);
//         // setPromotion(response);
//       },
//       onError: (response) => {
//         console.log(response);
//         messageApi.open({
//           type: 'error',
//           content: response.response.data.message,
//         });
//         setIsDetailOpen(false);
//       },
//     });
//   useEffect(() => {
//     mutatePromotion();
//     mutatePackage();
//   }, [value,createPromotion]);
//   const createDiscountHandler = (response) => {
//     const form = new FormData();
//     form.append('name', response.discountName);
//     form.append('discountAmount', parseInt(response.discountValue));
//     form.append('startDate', response.dateFirst.format('YYYY-MM-DD'));
//     form.append('endDate', response.dateLater.format('YYYY-MM-DD'));
//     form.append('description', response.description);
//     for (const packageItem of packageList) {
//       form.append('devicePackageIds', packageItem);
//     }
//     mutateCreatePromotion(form);
//   };
//   const onChangePackage = (value) => {
//     setPackageList(value);
//   };
//   return (
//     <>
//       {contextHolder}
//       <BreadCrumb />

//       <Modal
//         open={isDetailOpen}
//         onOk={handleDetailOk}
//         onCancel={handleDetailCancel}
//         cancelText={false}
//         cancelButtonProps={{ style: { display: 'none' } }}
//         okButtonProps={{ style: { display: 'none' } }}
//       >
//         <div className='flex items-center justify-between mb-[20px]'>
//           <span>Thêm khuyến mãi</span>
//         </div>
//         <Form
//           // form={form}
//           // initialValues={{
//           //   password: password,
//           //   fullName: tellerDetail?.fullName,
//           //   status: 'Active',
//           // }}

//           // 'checkbox-group': ['A', 'B'],
//           // rate: 3.5,
//           // 'color-picker': null,
//           layout='vertical'
//           onFinish={createDiscountHandler}
//         >
//           <div className='mb-[8px]'>
//             <Form.Item label='Tên mã giảm giá' name='discountName'>
//               <Input
//                 className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
//                 required
//                 placeholder='Nhập mã'
//               />
//               {/* <span>{tellerDetail?.phoneNumber}</span> */}
//             </Form.Item>
//           </div>

//           <div className='mb-[8px]'>
//             <Form.Item label='Phần trăm giảm' name='discountValue'>
//               <Input
//                 className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
//                 required
//                 placeholder='Nhập phần trăm giảm'
//               />
//             </Form.Item>
//           </div>
//           <div className='mb-[8px]'>
//             <Form.Item label='Ngày bắt đầu' name='dateFirst'>
//               <DatePicker
//                 style={{
//                   width: '100%',
//                   marginBottom: '15px',
//                 }}
//                 value={
//                   dayjs()
//                   // dayjs(surveyDetail?.surveyDate).format('YYYY-MM-DD'),
//                   // 'YYYY-MM-DD'
//                 }
//               />
//             </Form.Item>
//           </div>
//           <div className='mb-[8px]'>
//             <Form.Item label='Ngày kết thúc' name='dateLater'>
//               <DatePicker
//                 style={{
//                   width: '100%',
//                   marginBottom: '15px',
//                 }}
//                 value={
//                   dayjs()
//                   // dayjs(surveyDetail?.surveyDate).format('YYYY-MM-DD'),
//                   // 'YYYY-MM-DD'
//                 }
//               />
//             </Form.Item>
//           </div>
//           <div className='mb-[8px]'>
//             <Form.Item label='Mô tả' name='description'>
//               <TextArea
//                 rows={4}
//                 className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
//                 required
//                 placeholder='Nhập mô tả'
//               />
//             </Form.Item>
//           </div>
//           <div className='mb-[8px]'>
//             <Form.Item label='Chọn gói sản phẩm' name='package'>
//               <Select
//                 mode='multiple'
//                 allowClear
//                 style={{
//                   width: '100%',
//                 }}
//                 onChange={onChangePackage}
//                 options={packageDevice}
//               />
//             </Form.Item>
//           </div>
//           <Col span={24}>
//             <Flex justify='end' gap={4}>
//               <Button>Hủy</Button>
//               <Button
//                 type='primary'
//                 htmlType='submit'
//                 loading={createPromotion}
//               >
//                 Thêm
//               </Button>
//             </Flex>
//           </Col>
//         </Form>
//         {/* <div className='flex justify-end gap-[8px] mt-[20px]'>
//   <button className='rounded-[4px] text-white py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#3fc055]'>
//     Xác nhận
//   </button>
//   <button className='button__close rounded-[4px] text-[#dedbdb] py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#ec5b27]'>
//     Hủy bỏ
//   </button>
// </div> */}
//       </Modal>
//       <div className='px-[24px] pt-[20px]'>
//         <Spin tip='Loading...' spinning={contractLoading}>

//           <div className='bg-[white]  pt-[13px] pb-[16px] '>

//           <div className='flex items-center justify-between px-[14px] mb-[15px]'>
//               <span className='text-[#495057] font-poppin font-medium text-[16px]'>
//                 Danh sách khuyến mãi
//               </span>
//             </div>
// <div className='flex items-center justify-between mx-[20px] mb-[20px] '>

//   <span className='flex items-center justify-between bg-[#0AB39C] px-[15px] py-[10px] rounded-[4px]'>
//     <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
//     <button
//       onClick={showDetailModal}
//       className='text-white font-poppin font-normal text-[13px] '
//     >
//       Thêm khuyến mãi
//     </button>
//   </span>
//   <div className='flex items-center relative'>
//     <Icon
//       icon='material-symbols-light:search'
//       style={{ color: '#9599AD' }}
//       className='absolute left-[13px]'
//     />
//     <input
//       onChange={(ev) => setValue(ev.target.value)}
//       type='text'
//       placeholder='Tìm kiếm...'
//       className='font-poppin outline-none font-normal text-[13px] w-[300px] rounded-[4px] bg-[#F3F3F9] pt-[8px] pb-[10px] pl-[40px] pr-[10px]'
//     />
//   </div>
// </div>
//             <table className='w-full'>
//               <tr className=''>
//                 <th className='w-[10%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Tên mã
//                 </th>
//                 <th className='w-[20%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Phần trăm giảm
//                 </th>

//                 <th className='w-[15%] pl-[20px] text-center  font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Ngày bắt đầu
//                 </th>
//                 <th className='w-[10%] pl-[20px] text-center  font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Ngày kết thúc
//                 </th>
//               </tr>

//               {promotion?.data?.map((item) => (
//                 <tr className='border-t border-b border-[#E9EBEC] '>
//                   <td className='gap-[8px] pl-[14px] py-[12px] '>
//                     <div className='text-center'>
//                       <span className='font-poppin text-[14px] font-medium text-[#495057] '>
//                         {item.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex justify-center'>
//                       <span className='inline-block font-poppin text-[14px] font-medium '>
//                         {item.discountAmount}%
//                       </span>
//                     </div>
//                   </td>

//                   <td className=''>
//                     <div className='text-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {dayjs(item.startDate).format('DD-MM-YYYY')}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='text-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {dayjs(item.endDate).format('DD-MM-YYYY')}
//                       </span>
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
// {
//   /* <td className='px-[21px]'>
// <div className='flex flex-col items-start'>
//   <span className='font-poppin text-[14px] font-medium'>
//     {item.price}
//   </span>
//   <Link to="/invoices" className='font-poppin text-[13px] font-normal text-red-600 inline-block py-[10px] px-[20px] '>
//     Xem chi tiết
//   </Link>
// </div>
// </td> */
// }
