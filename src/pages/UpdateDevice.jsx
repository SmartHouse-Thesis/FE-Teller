import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
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
import { Button, Checkbox, Form, Input, Select, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import promotionAPI from '../api/promotion';
import manufactureAPI from '../api/manufacture';
import devicesAPI from '../api/device';
import { formatCurrency } from '../utils/formatCurrentcy';
import TextArea from 'antd/es/input/TextArea';
export function UpdateDevice() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [devices, setDevices] = useState();
  const [listDevices, setListDevice] = useState({
    responses: [],
  });
  const [newDevices, setNewDevices] = useState();
  const [promotion, setPromotion] = useState({
    responses: [],
  });
  const [manu, setManu] = useState();
  const [newArr, setNewArr] = useState([]);
  const [deviceId, setDeviceId] = useState();
  let { id } = useParams();

  const navigate = useNavigate();
  const { isPending: contractLoading, mutate } = useMutation({
    mutationFn: () => promotionAPI.getPromotion(),
    onSuccess: (response) => {
      const outputArray = [];

      response.data.forEach((item) => {
        outputArray.push({
          value: item.id,
          label: item.name,
        });
      });
      setPromotion(outputArray);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get products list',
      });
    },
  });
  const { isPending: deviceItemLoading, mutate: mutateDeviceById } =
    useMutation({
      mutationFn: () => devicesAPI.getSmartDeviceById(id),
      onSuccess: (response) => {
        setNewDevices(response);
        form.setFieldsValue({
          name: response.name,
          price: response.price,
          status: 'Active',
          deviceType: response.deviceType,
          installationPrice: response.installationPrice,
          description: response.description,
          manufacture: response.manufacturer.id,
          // password: password
        });
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
      const outputArray = [];
      console.log(response);
      response?.forEach((item) => {
        outputArray.push({
          value: item.id,
          label: item.name,
        });
      });
      setManu(outputArray);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get manufactures list',
      });
    },
  });
  useEffect(() => {
    MutateManu();
  }, []);
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
  const { isPending: updateProductLoading, mutate: mutateUpdate } = useMutation(
    {
      mutationFn: (params) => devicesAPI.updateSmartDevice(params, deviceId),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Cập nhật thiết bị thành công',
        });
        setTimeout(() => {
          navigate('/device-page')
        }, 1000)
      },
      onError: (error) => {
        messageApi.open({
          type: 'error',
          content: error.response.data.message,
        });
      },
    }
  );
  useEffect(() => {
    if (id) {
      setDeviceId(id);
      mutateDeviceById(id);
      mutate();
    }
  }, [id]);
  const handleChange = (value) => {
    const updatedArr = [...newArr];
    for (let i = 0; i <= listDevices.data.length; i++) {
      if (listDevices?.data[i]?.id == value) {
        updatedArr.push(listDevices.data[i]);
      }
    }
    setNewArr(updatedArr);
  };
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }
  const onUpdateDeviceHandle = (response) => {
    console.log(response);
    mutateUpdate({
      deviceId: deviceId,
      manufacturerId: response.manufacture,
      name: response.name,
      description: response.description,
      deviceType: response.deviceType,
      price: response.price,
      installationPrice: response.installationPrice,
      status: 'Active',
    });
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

      <div className='pr-[23px] pl-[70px] pt-[20px] -mt-[200px]'>
        <div className='grid grid-cols-[1fr] gap-[30px] items-start'>
          <div className='bg-white shadow-md'>
            <Spin tip='Loading...' spinning={deviceItemLoading}>
              <div className='px-[24px] py-[20px]'>
                <Form
                  form={form}
                  layout='vertical'
                  onFinish={onUpdateDeviceHandle}
                >
                  <div className='flex items-center mb-[15px] gap-[24px]'>
                    <div className='w-full'>
                      <div className='mb-[8px]'>
                        <Form.Item label='Tên sản phẩm' name='name'>
                          <Input
                            className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                            required
                            defaultValue={newDevices?.name}
                          />
                          {/* <span>{tellerDetail?.phoneNumber}</span> */}
                        </Form.Item>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='w-full'>
                        <Form.Item label='Nhà sản xuất' name='manufacture'>
                          {/* <Select
                        className=''
                        defaultValue={manu[0]?.value}
                        style={{
                          width: '100%',
                        }}
                        options={manu}
                      /> */}
                          <Select
                            className=''
                            placeholder='Input manufacture'
                            style={{
                              width: '100%',
                            }}
                            value={newDevices?.manufacturer.name}
                            open={open}
                            onDropdownVisibleChange={(visible) =>
                              setOpen(visible)
                            }
                            dropdownRender={(menu) => <div>{menu}</div>}
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
                    <div className='w-full'>
                      <div className='mb-[8px]'>
                        <Form.Item label='Loại sản phẩm' name='deviceType'>
                          <Input
                            className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                            required
                            defaultValue={newDevices?.deviceType}
                          />
                          {/* <span>{tellerDetail?.phoneNumber}</span> */}
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center mb-[15px] gap-[24px]'>
                    <div className='w-full'>
                      <div className='mb-[8px]'>
                        <Form.Item label='Giá bán' name='price'>
                          <Input
                            className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                            required
                            defaultValue={newDevices?.price}
                          />
                          {/* <span>{tellerDetail?.phoneNumber}</span> */}
                        </Form.Item>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='mb-[8px]'>
                        <Form.Item label='Giá lắp đặt' name='installationPrice'>
                          <Input
                            className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                            required
                            defaultValue={newDevices?.installationPrice}
                          />
                          {/* <span>{tellerDetail?.phoneNumber}</span> */}
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center mb-[15px] gap-[24px]'>
                    <div className='w-full'>
                      <div className='mb-[8px]'>
                        <Form.Item label='Mô tả' name='description'>
                          <TextArea
                            rows={6}
                            className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                            required
                            defaultValue={newDevices?.description}
                          />
                          {/* <span>{tellerDetail?.phoneNumber}</span> */}
                        </Form.Item>
                      </div>
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
                        <div
                          className='dz-message needsclick'
                          {...getRootProps()}
                        >
                          <div className='flex items-center justify-center flex-col border p-[20px]'>
                            <div className='flex gap-[20px]'>
                              {newDevices?.images.map((item) => (
                                <img
                                  src={item.url}
                                  alt=''
                                  className='w-[150px] h-[150px]'
                                />
                              ))}
                            </div>
                            <h4 className='mt-[20px]'>Thêm ảnh</h4>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <div className='flex justify-end gap-[8px] mt-[8px]'>
                    <button className='rounded-[4px] text-white py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#364574]'>
                      Cập nhật
                    </button>
                    <button className='rounded-[4px] text-[#0AB39C] py-[8.5px] px-[15.5px] text-[13px] font-normal font-poppin bg-[#a5f3e8]'>
                      Hủy
                    </button>
                  </div>
                </Form>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
}
