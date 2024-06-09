import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import profileImage from '../../public/image/profile.jpeg';
import overlay from '../../public/image/overlayprofile.png';
import github from '../../public/image/github-icon.png';
import { Icon } from '@iconify/react';
import { Pagination } from '../components/Pagination';
import productImg from '../../public/image/clother.png';
import user from '../../public/image/user.png';
import { BreadCrumb } from '../components/BreadCrumb';
import { SearchInput } from '../components/SearchInput';
import Dropzone from 'react-dropzone';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import promotionAPI from '../api/promotion';
import manufactureAPI from '../api/manufacture';
import devicesAPI from '../api/device';
import { formatCurrency } from '../utils/formatCurrentcy';
import packageAPI from '../api/package';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import axiosClient, { axiosFormClient } from '../api/axiosClient';

const { Option } = Select;

export function CreateDevice() {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openManu, setOpenManu] = useState(false);
  const [openPromotion, setOpenPromotion] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [devices, setDevices] = useState();
  const [promotionList, setPromotionList] = useState([]);
  const [selectedFiles, setselectedFiles] = useState();
  const [filterDevices, setFilterDevices] = useState([]);
  const [manufactureId, setmanufactureId] = useState();
  const [listDevices, setListDevice] = useState({
    responses: [],
  });
  const [newArr, setNewArr] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [manu, setManu] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();
  const { isPending: contractLoading, mutate } = useMutation({
    mutationFn: () => promotionAPI.getPromotion(),
    onSuccess: (response) => {
      const outputArray = response.data.map(item => ({
        value: item.id,
        label: item.name,
        discountAmount: item.discountAmount,
      }));
      setPromotion(outputArray);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get products list',
      });
    },
  });

  const { isPending: manufactureLoading, mutate: MutateManu } = useMutation({
    mutationFn: () => manufactureAPI.getManufacture(),
    onSuccess: (response) => {
      const outputArray = response.map(item => ({
        value: item.id,
        label: item.name,
      }));
      setManu(outputArray);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get manufactures list',
      });
    },
  });

  const { isPending: createDevicePackageLoading, mutate: mutateDevicePackge } =
    useMutation({
      mutationFn: (params) => packageAPI.createDevicePage(params),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Tạo gói sản phẩm thành công',
        });
        setTimeout(() => {
          navigate("/package-page");
        }, 1000)
      },
      onError: () => {
        messageApi.open({
          type: 'error',
          content: 'Error occur when get manufactures list',
        });
      },
    });

  const { isPending: deviceListLoading, mutate: mutateDevices } = useMutation({
    mutationFn: () => devicesAPI.getSmartDevice(manufactureId),
    onSuccess: (response) => {
      const outputArray = response.data.map(item => ({
        value: item.id,
        label: item.name,
      }));
      setListDevice(response);
      setDevices(outputArray);
    },
    onError: () => {},
  });

  useEffect(() => {
    mutate();
    MutateManu();
  }, []);

  useEffect(() => {
    if (manufactureId) {
      mutateDevices();
    }
  }, [manufactureId]);

  useEffect(() => {
    if (promotionList.length > 0) {
      const selectedPromotion = promotion.find(item => item.value === promotionList[0]);
      setDiscountAmount(selectedPromotion ? selectedPromotion.discountAmount : 0);
    } else {
      setDiscountAmount(0);
    }
  }, [promotionList]);

  const handleChange = (value) => {
    const updatedArr = [...newArr];
    let newArray = listDevices.data.map((item) => ({
      ...item,
      quantity: 1,
    }));

    for (let i = 0; i <= newArray.length; i++) {
      if (newArray[i]?.id === value) {
        let existingItemIndex = updatedArr.findIndex(
          (item) => item.id === newArray[i].id
        );
        if (existingItemIndex !== -1) {
          updatedArr[existingItemIndex].quantity++;
        } else {
          updatedArr.push(newArray[i]);
        }
      }
    }
    const filteredDevices = updatedArr.map((device) => ({
      smartDeviceId: device.id,
      quantity: device.quantity,
    }));
    setFilterDevices(filteredDevices);
    setNewArr(updatedArr);
  };

  const totalPrice = (newArr) => {
    return newArr?.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalAllPrice = (newArr, discountAmount) => {
    let totalAllPrice = newArr?.reduce(
      (total, item) => total + (item.price + item.installationPrice) * item.quantity,
      0
    );
    if (discountAmount) {
      totalAllPrice = totalAllPrice - totalAllPrice * (discountAmount / 100);
    }
    return totalAllPrice;
  };

  const increaseQuantity = (index) => {
    const newArrCopy = [...newArr];
    newArrCopy[index].quantity += 1;
    const filteredDevices = newArrCopy.map((device) => ({
      smartDeviceId: device.id,
      quantity: device.quantity,
    }));
    setFilterDevices(filteredDevices);
    setNewArr(newArrCopy);
  };

  const decreaseQuantity = (index) => {
    const newArrCopy = [...newArr];
    if (newArrCopy[index].quantity > 0) {
      newArrCopy[index].quantity -= 1;
    }
    const filteredDevices = newArrCopy.map((device) => ({
      smartDeviceId: device.id,
      quantity: device.quantity,
    }));
    setFilterDevices(filteredDevices);
    setNewArr(newArrCopy);
  };

  const checkFileType = (files) => {
    const acceptedFileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/svg+xml',
      'image/tiff',
      'image/webp'
    ];
    return files.every(file => acceptedFileTypes.includes(file.type));
  };

  const handleAcceptedFiles = (files) => {
    if(checkFileType(files)){
      setselectedFiles(files[0]);
      messageApi.success({
        type: 'success',
        content: 'File uploaded successfully'
      });
    } else {
      messageApi.error({
        type: 'error',
        content: 'Please select an image file'
      });
    }
  };

  const onManuChange = (value) => {
    setmanufactureId(value);
  };

  const filterRemoveHandle = (itemId) => {
    const arrRemove = newArr.filter(item => item.id !== itemId);
    const newFilterDevices = filterDevices.filter(item => item.smartDeviceId !== itemId);
    setNewArr(arrRemove);
    setFilterDevices(newFilterDevices);
  };

  const onSubmitCreateDevice = (response) => {
    const form = new FormData();
    form.append('manufacturerId', response.manuId);
    for (const promotion of promotionList) {
      form.append('promotionIds', promotion);
    }
    form.append('name', response.packageName);
    form.append('warrantyDuration', response.warranty);
    form.append('description', response.description);
    form.append('completionTime', response.dateInstall);
    form.append('image', selectedFiles);
    for (const device of filterDevices) {
      form.append('smartDeviceIds', JSON.stringify(device));
    }
    mutateDevicePackge(form);
  };

  return (
    <>
      {contextHolder}
      <div
        className='relative -z-50'
        style={{
          width: '100%',
          height: '260px',
          backgroundImage: `url(${overlay})`,
          backgroundSize: 'cover',
        }}
      >
        <div className='absolute w-full h-[260px] bg-[#405189] opacity-60'></div>
      </div>
      <Form layout='vertical' onFinish={onSubmitCreateDevice}>
        <div className='pr-[23px] pl-[70px] pt-[20px] -mt-[200px]'>
          <div className='grid grid-cols-[1fr] gap-[30px] items-start'>
            <div className='bg-white shadow-md'>
              <div className='px-[24px] py-[20px]'>
                <div className='flex items-center mb-[15px] gap-[24px]'>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item
                        label='Nhập tên gói sản phẩm'
                        name='packageName'
                      >
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input device package name'
                        ></Input>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item
                        label='Số ngày lắp đặt dự kiến'
                        name='dateInstall'
                      >
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input estimated installation date'
                        ></Input>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='w-full'>
                      <Form.Item label='Chọn hãng' name='manuId'>
                        <Select
                          placeholder='Select manufacture'
                          style={{
                            width: '100%',
                          }}
                          open={openManu}
                          onDropdownVisibleChange={(visible) =>
                            setOpenManu(visible)
                          }
                          onChange={onManuChange}
                        >
                          {manu?.map((item, index) => (
                            <Option value={item.value} key={index}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className='flex items-center mb-[15px] gap-[24px]'>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item label='Chọn mã giảm giá' name='promotion'>
                        <Select
                          mode='multiple'
                          placeholder='Select promotion'
                          style={{
                            width: '100%',
                          }}
                          open={openPromotion}
                          onDropdownVisibleChange={(visible) =>
                            setOpenPromotion(visible)
                          }
                          onChange={setPromotionList}
                        >
                          {promotion?.map((item, index) => (
                            <Option value={item.value} key={index}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full'>
                    <Form.Item
                      label='Nhập thời hạn bảo hành (tháng)'
                      name='warranty'
                    >
                      <Input
                        className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                        required
                        placeholder='Input warranty duration(month)'
                      ></Input>
                    </Form.Item>
                  </div>
                </div>
                <div className='flex items-center mb-[15px] gap-[24px]'>
                  <div className='w-full'>
                    <Form.Item label='Nhập mô tả' name='description'>
                      <TextArea
                        className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                        required
                        placeholder='Input description'
                        rows={8}
                      ></TextArea>
                    </Form.Item>
                  </div>
                </div>
                <div className='mb-[8px]'>
                  <label
                    className='font-poppin font-medium text-[13px]'
                    htmlFor=''
                  >
                    Upload ảnh
                  </label>
                </div>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    handleAcceptedFiles(acceptedFiles);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className='dropzone dz-clickable'>
                      <div
                        className='dz-message needsclick'
                        {...getRootProps()}
                      >
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
                <div className='flex items-center mb-[15px] gap-[24px]'>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <label
                        className='font-poppin font-medium text-[13px]'
                        htmlFor=''
                      >
                        Sản phẩm (của hãng)
                      </label>
                    </div>
                    <div className='w-full'>
                      <Select
                        showSearch
                        className=''
                        style={{
                          width: '100%',
                        }}
                        value={undefined}
                        placeholder='Input manufactor of product'
                        open={openProduct}
                        filterOption={(input, option) =>
                          (option?.label ?? '').includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleChange}
                        options={devices}
                        onDropdownVisibleChange={(visible) =>
                          setOpenProduct(visible)
                        }
                        dropdownRender={(menu) => <div>{menu}</div>}
                      >
                        {devices?.map((item) => (
                          <Option value={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-[1fr_480px] items-start mt-[20px] gap-[30px]'>
            <div className='px-[24px] pt-[24px]'>
              <div className='bg-[white]  pt-[13px] pb-[16px] shadow-md'>
                <div className='flex items-center justify-between mx-[20px] mb-[20px] '>
                  {/* <SearchInput /> */}
                </div>
                <table>
                  <tr className=''>
                    <th className='w-[40%] pl-[20px] text-start font-poppin font-semibold text-[13px] text-[#9599AD]'>
                      Tên thiết bị
                    </th>
                    <th className='w-[20%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
                      Số lượng
                    </th>
                    <th className='w-[15%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
                      Giá
                    </th>
                    <th className='w-[15%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
                      Giá lắp đặt
                    </th>
                    <th className='w-[10%] pl-[20px] text-start  font-poppin font-semibold text-[13px] text-[#9599AD]'>
                      Xóa
                    </th>
                  </tr>
                  {newArr?.map((item, index) => (
                    <tr className='border-t border-b border-[#E9EBEC] ' key={item.id}>
                      <td className='gap-[8px] pl-[14px] py-[12px] flex  items-center '>
                        <img
                          src={item.images[0].url}
                          className='w-[24px] h-[24px]'
                        />
                        <div className='flex flex-col'>
                          <span className='font-poppin text-[14px] font-medium text-[#495057] '>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className=''>
                        <div className='flex items-center'>
                          <span
                            onClick={() => decreaseQuantity(index)}
                            className='btn decrease bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-l'
                          >
                            -
                          </span>
                          <input
                            type='text'
                            className='quantity-input bg-white focus:outline-none focus:ring focus:border-blue-300 border-l border-r w-16 text-center'
                            value={item.quantity}
                            readOnly
                          ></input>

                          <span
                            onClick={() => increaseQuantity(index)}
                            className='btn increase bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-r'
                          >
                            +
                          </span>
                        </div>
                      </td>
                      <td className=''>
                        <div className='flex flex-col items-start'>
                          <span className='text-center font-poppin text-[14px] font-medium'>
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </td>
                      <td className=''>
                        <div className=''>
                          <span className='pl-[20px] text-center font-poppin text-[14px] font-medium'>
                            {formatCurrency(item.installationPrice)}
                          </span>
                        </div>
                      </td>
                      <td className=''>
                        <div className='flex items-center justify-center cursor-pointer'>
                          <span className='cursor-pointer text-center font-poppin text-[14px] font-medium'>
                            <Icon
                              onClick={() => filterRemoveHandle(item.id)}
                              icon='material-symbols:delete-forever-outline'
                              width='20'
                              height='20'
                              style={{ color: '#f37272' }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            <div className='py-[20px] px-[20px] shadow-md'>
              <div className='flex items-center justify-between mb-[20px]'>
                <span className='font-poppin font-medium text-[16px]'>Giá</span>
              </div>
              <div className='border-b border-[#000] pb-[20px]'>
                <div className='flex items-center justify-between'>
                  <span className='inline-block font-poppin font-normal text-[16px] mb-[15px]'>
                    Tổng giá
                  </span>
                  <span className='inline-block font-poppin font-normal text-[16px] mb-[15px]'>
                    {formatCurrency(totalPrice(newArr))}
                  </span>
                </div>
                <br />
                <div className='flex items-center justify-between'>
                  <span className='inline-block font-poppin font-normal text-[16px]'>
                    Chiết khấu
                  </span>
                  <span className='inline-block font-poppin font-normal text-[16px]'>
                    {discountAmount}%
                  </span>
                </div>
              </div>
              <div className='flex items-center justify-between mt-[20px]'>
                <span className='inline-block font-poppin font-normal text-[16px] mb-[15px]'>
                  Tổng
                </span>
                <span className='inline-block font-poppin font-normal text-red-500 text-[16px] mb-[15px]'>
                  {formatCurrency(totalAllPrice(newArr, discountAmount))}
                </span>
              </div>
              <Button
                type='primary'
                htmlType='submit'
                loading={createDevicePackageLoading}
              >
                Tạo gói sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}