// import { Icon } from '@iconify/react';
// import productImg from '../../public/image/clother.png';
// import user from '../../public/image/user.png';
// import { Pagination } from '../components/Pagination';
// import { BreadCrumb } from '../components/BreadCrumb';
// import { SearchInput } from '../components/SearchInput';
// import devicesAPI from '../api/device';
// import {
//   Button,
//   Col,
//   Flex,
//   Form,
//   Input,
//   Modal,
//   Row,
//   Select,
//   Spin,
//   message,
// } from 'antd';
// import { useEffect, useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import manufactureAPI from '../api/manufacture';
// import TextArea from 'antd/es/input/TextArea';
// import Dropzone from 'react-dropzone';
// import dayjs from 'dayjs';

// export function Manufacture() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [manufacture, setManufacture] = useState();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const [isMutationSuccess, setIsMutationSuccess] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState();
//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
//   const showDetailModal = () => {
//     setIsDetailOpen(true);
//   };
//   const handleDetailOk = () => {
//     setIsDetailOpen(false);
//   };
//   const handleDetailCancel = () => {
//     setIsDetailOpen(false);
//   };
//   function handleAcceptedFiles(files) {
//     files.map((file) =>
//       Object.assign(file, {
//         preview: URL.createObjectURL(file),
//       })
//     );
//     setSelectedFiles(files[0]);
//   }

//   const checkFileType = (files) => {
//     const acceptedFileTypes = [
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'image/bmp',
//       'image/svg+xml',
//       'image/tiff',
//       'image/webp',
//     ];
//     return files.every((file) => acceptedFileTypes.includes(file.type));
//   };
//   const { isPending: addManufacturePending, mutate: mutateAddManufacture } =
//     useMutation({
//       mutationFn: manufactureAPI.addManufacture,
//       onSuccess: () => {
//         messageApi.open({
//           type: 'success',
//           content: 'Add product manufacture is successfull',
//         });
//         setIsMutationSuccess(true);
//         setIsModalOpen(false);
//       },
//       onError: () => {
//         messageApi.open({
//           type: 'error',
//           content: 'Error occur when add manufacture',
//         });
//       },
//     });
//   // const onAddManufacture = () => {
//   //   mutateAddIntoQuotation({
//   //     name:
//   //   });
//   // };
//   useEffect(() => {
//     mutate();
//   }, [isMutationSuccess]);
//   const onSubmitForm = (response) => {
//     mutateAddManufacture({
//       name: response.name,
//       origin: response.origin,
//       description: response.description,
//       image: selectedFiles,
//     });
//   };
//   function truncateText(text, maxLength) {
//     if (text.length <= maxLength) {
//       return text;
//     } else {
//       return text.substring(0, maxLength) + '...';
//     }
//   }

//   return (
//     <>
//       {contextHolder}
//       <BreadCrumb />
//       <Modal
//         open={isModalOpen}
//         onCancel={handleCancel}
//         cancelText={false}
//         cancelButtonProps={{ style: { display: 'none' } }}
//         okButtonProps={{ style: { display: 'none' } }}
//       >
//         <div className='flex items-center justify-between mb-[20px]'>
//           <span>Thêm hãng</span>
//         </div>
//         <Form layout='vertical' onFinish={onSubmitForm}>
//           <Row gutter={[10, 10]}>
//             <Col span={24}>
//               <Form.Item label='Tên hãng sản xuất' name='name'>
//                 <Input type='text' required placeholder='Input manufactor ' />
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               <Form.Item label='Nhập xuất xứ' name='origin'>
//                 <Input type='text' required placeholder='Input origin' />
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               <Form.Item label='Nhập mô tả' name='description'>
//                 <TextArea
//                   type='text'
//                   required
//                   placeholder='Input description'
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               <Dropzone
//                 onDrop={(acceptedFiles) => {
//                   if (checkFileType(acceptedFiles)) {
//                     handleAcceptedFiles(acceptedFiles);
//                   } else {
//                     messageApi.error({
//                       type: 'error',
//                       content: 'Vui lòng chọn file là ảnh',
//                     });
//                   }
//                 }}
//               >
//                 {({ getRootProps, getInputProps }) => (
//                   <div className='dropzone dz-clickable'>
//                     <div className='dz-message needsclick' {...getRootProps()}>
//                       <div className='flex items-center justify-center flex-col border p-[20px]'>
//                         {selectedFiles ? (
//                           <img
//                             src={selectedFiles?.preview}
//                             alt=''
//                             className='w-[200px] h-[200px]'
//                           />
//                         ) : (
//                           <Icon
//                             icon='mdi:cloud-upload'
//                             className='w-[100px] h-[100px]'
//                             style={{ color: '#212529' }}
//                           />
//                         )}

//                         {selectedFiles ? (
//                           ''
//                         ) : (
//                           <h4>Drop files here or click to upload.</h4>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Dropzone>
//             </Col>
//             <Col span={24}>
//               <Flex justify='end' gap={4}>
//                 <Button onClick={handleCancel}>Hủy</Button>
//                 <Button
//                   type='primary'
//                   htmlType='submit'
//                   loading={addManufacturePending}
//                 >
//                   Thêm
//                 </Button>
//               </Flex>
//             </Col>
//           </Row>
//         </Form>
//         {/* <div className='flex justify-end gap-[8px] mt-[20px]'>
//             <button className='rounded-[4px] text-white py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#3fc055]'>
//             Xác nhận
//             </button>
//             <button className='button__close rounded-[4px] text-[#dedbdb] py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#ec5b27]'>
//             Hủy bỏ
//             </button>
//           </div> */}
//       </Modal>
//       <div className='px-[24px] pt-[24px]'>
//         <Spin tip='Loading...' spinning={manufactureLoading}>
//           <div className='bg-[white]  pt-[13px] pb-[16px] '>
//             <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
//               <span className='flex items-center justify-between bg-[#0AB39C] px-[15px] py-[10px] rounded-[4px]'>
//                 <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
//                 <button
//                   onClick={showModal}
//                   className='text-white font-poppin font-normal text-[13px] '
//                 >
//                   Thêm hãng
//                 </button>
//               </span>
//               <SearchInput />
//             </div>
//             <div className='flex items-center justify-between px-[14px] mb-[15px]'>
//               <span className='text-[#495057] font-poppin font-medium text-[16px]'>
//                 Danh sách Hãng
//               </span>
//             </div>
//             <table className='w-full'>
//               <tr className=''>
//                 <th className='w-[15%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Tên hãng
//                 </th>
//                 <th className='w-[15%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Hình ảnh
//                 </th>
//                 <th className='w-[15%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Nguồn gốc
//                 </th>
//                 <th className='w-[35%] pl-[20px] text-center font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Thông tin
//                 </th>
//                 <th className='w-[20%] pl-[20px] text-center  font-poppin font-semibold text-[13px] text-[#9599AD]'>
//                   Ngày tạo
//                 </th>
//               </tr>

//               {manufacture?.map((item) => (
//                 <tr className='border-t border-b border-[#E9EBEC] '>
//                   <td className='pl-[20px] h-[40px]'>
//                     <div className='flex flex-col items-start'>
//                       <span className='font-poppin text-[14px] font-medium w-full'>
//                         {item.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         <img src={item.image} className='w-[30px] h-[30px]' />
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {item.origin}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {truncateText(item.description, 40)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className=''>
//                     <div className='flex flex-col items-center'>
//                       <span className='text-center font-poppin text-[14px] font-medium'>
//                         {dayjs(item.createAt).format('DD-MM-YYYY')}
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
import React, { useState, useEffect } from 'react';
import { Spin, message, Input, Table, Popconfirm, Image, Pagination, Row, Col, Button } from 'antd';
import { BreadCrumb } from '../components/BreadCrumb';
import manufactureAPI from '../api/manufacture';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '../hook/useDebounce';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { Form } from 'antd';
import Dropzone from 'react-dropzone';
import TextArea from 'antd/es/input/TextArea';
import { Modal } from 'antd';
import { Flex } from 'antd';

export function Manufacture() {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchValue, setSearchValue] = useDebounce('', 500);
  const [manufactures, setManufactures] = useState([]);
  const [filteredManufactures, setFilteredManufactures] = useState([]);
  const [openPopupConfirm, setOpenPopUpConfirm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMutationSuccess, setIsMutationSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState();
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
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles(files[0]);
  }

  const checkFileType = (files) => {
    const acceptedFileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/svg+xml',
      'image/tiff',
      'image/webp',
    ];
    return files.every((file) => acceptedFileTypes.includes(file.type));
  };
  const { isPending: addManufacturePending, mutate: mutateAddManufacture } =
    useMutation({
      mutationFn: manufactureAPI.addManufacture,
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: 'Thêm hãng sản xuất thành công',
        });
        setIsMutationSuccess(true);
        setIsModalOpen(false);
      },
      onError: (error) => {
        messageApi.open({
          type: 'error',
          content: error.response.data.message,
        });
      },
    });
  // const onAddManufacture = () => {
  //   mutateAddIntoQuotation({
  //     name:
  //   });
  // };
  useEffect(() => {
    mutate();
  }, [isMutationSuccess]);
  const { isPending: manufactureListLoading, mutate } = useMutation({
    mutationFn: () => manufactureAPI.getManufacture(searchValue),
    onSuccess: (response) => {
      setManufactures(response);
      setFilteredManufactures(response);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occurred when getting manufactures list',
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [searchValue]);

  useEffect(() => {
    const originValues = manufactures.map((manufacture) => manufacture.origin);
    // Lọc các giá trị trùng lặp trước khi đặt vào originFilters
    const uniqueOriginValues = [...new Set(originValues)];
    setOriginFilters(uniqueOriginValues);
  }, [manufactures]);

  const handleCancelPopUpConfirm = () => {
    setOpenPopUpConfirm(false);
  };

  const showPopconfirm = (manufactureId) => {
    setOpenPopUpConfirm(true);
  };

  const handleOkPopUpConfirm = (manufactureId) => {
    // Handle confirmation action
  };

  const handleNameSearch = (value) => {
    setSearchValue(value);
  };
  const onSubmitForm = (response) => {
    mutateAddManufacture({
      name: response.name,
      origin: response.origin,
      description: response.description,
      image: selectedFiles,
    });
  };
  const [originFilters, setOriginFilters] = useState([]);

  const columns = [
    {
      title: 'Tên hãng',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={30} />,
    },
    {
      title: 'Nguồn gốc',
      dataIndex: 'origin',
      key: 'origin',
      filters: originFilters.map((origin) => ({ text: origin, value: origin })),
      onFilter: (value, record) => record.origin === value,
    },
    {
      title: 'Thông tin',
      dataIndex: 'description',
      key: 'description',
      render: (description) => description.slice(0, 30) + '...',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (createAt) => dayjs(createAt).format('DD-MM-YYYY'),
    },

  ];

  return (
    <>
    {contextHolder}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        cancelText={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex items-center justify-between mb-[20px]'>
          <span>Thêm hãng</span>
        </div>
        <Form layout='vertical' onFinish={onSubmitForm}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Form.Item label='Tên hãng sản xuất' name='name'>
                <Input type='text' required placeholder='Input manufactor ' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Nhập xuất xứ' name='origin'>
                <Input type='text' required placeholder='Input origin' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Nhập mô tả' name='description'>
                <TextArea
                  type='text'
                  required
                  placeholder='Input description'
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  if (checkFileType(acceptedFiles)) {
                    handleAcceptedFiles(acceptedFiles);
                  } else {
                    messageApi.error({
                      type: 'error',
                      content: 'Vui lòng chọn file là ảnh',
                    });
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className='dropzone dz-clickable'>
                    <div className='dz-message needsclick' {...getRootProps()}>
                      <div className='flex items-center justify-center flex-col border p-[20px]'>
                        {selectedFiles ? (
                          <img
                            src={selectedFiles?.preview}
                            alt=''
                            className='w-[200px] h-[200px]'
                          />
                        ) : (
                          <Icon
                            icon='mdi:cloud-upload'
                            className='w-[100px] h-[100px]'
                            style={{ color: '#212529' }}
                          />
                        )}

                        {selectedFiles ? (
                          ''
                        ) : (
                          <h4>Drop files here or click to upload.</h4>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Dropzone>
            </Col>
            <Col span={24}>
              <Flex justify='end' gap={4}>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={addManufacturePending}
                >
                  Thêm
                </Button>
              </Flex>
            </Col>
          </Row>
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
      <BreadCrumb />
      <div className='px-[24px] pt-[24px]'>
        <Spin tip='Loading...' spinning={manufactureListLoading}>
        <div className='flex items-center justify-between pt-[20px] mx-[20px]'>
               <span className='flex items-center justify-between bg-[#0AB39C] px-[15px] py-[10px] rounded-[4px]'>
                 <Icon icon='ic:baseline-plus' style={{ color: 'white' }} />
                 <button
                  onClick={showModal}
                  className='text-white font-poppin font-normal text-[13px] '
                >
                  Thêm hãng
                </button>
              </span>
              {/* <SearchInput /> */}
            </div>
          <div className='bg-white pt-13 pb-16'>

            <div className='py-[20px] flex items-center justify-between px-14 mb-15'>
              <span className='text-#495057 font-poppin font-medium text-16'>
                Danh sách các hãng sản xuất
              </span>

            </div>
            <Table
              columns={columns}
              dataSource={filteredManufactures}
              pagination={{ pageSize: 10 }}
              rowKey='id'
              scroll={{ x: 'max-content' }}
            />
         
          </div>
        </Spin>
      </div>
    </>
  );
}