import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import profileImage from '../../public/image/profile.jpeg';
import overlay from '../../public/image/overlayprofile.png';
import github from '../../public/image/github-icon.png';
import { Icon } from '@iconify/react';
import Dropzone from 'react-dropzone';
import { Button, Form, Input, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import manufactureAPI from '../api/manufacture';
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import devicesAPI from '../api/device';
export function AddProduct() {
  const [manu, setManu] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFiles] = useState();
  const navigate = useNavigate();
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setSelectedFiles(files[0]);
  }
  const { isPending: createSmartDevices, mutate: mutateSmartDevice } =
    useMutation({
      mutationFn: (params) => devicesAPI.createSmartDevice(params),
      onSuccess: (response) => {
        messageApi.open({
          type: 'success',
          content: 'Tạo sản phẩm thành công',
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
    });
  const { isPending: manufactureLoading, mutate: MutateManu } = useMutation({
    mutationFn: () => manufactureAPI.getManufacture(),
    onSuccess: (response) => {
      const outputArray = [];

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
  const onCreateSmartDevice = (response) => {
    console.log(response);
    const form = new FormData();
    form.append('manufacturerId', response.manuId);
    form.append('name', response.deviceName);
    form.append('description', response.description);
    form.append('deviceType', response.typeDevice);
    form.append('price', response.price);
    form.append('installationPrice', response.installPrice);
    form.append('images', selectedFile);
    mutateSmartDevice(form);
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
  useEffect(() => {
    MutateManu();
  }, []);
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
        <div className='absolute w-full h-[260px] bg-[#405189] opacity-60 '></div>
      </div>
      <div className='pr-[23px] pl-[70px] pt-[20px] -mt-[200px]'>
        <div className='grid grid-cols-[1fr] gap-[30px] items-start'>
          <div className='bg-white shadow-md  pb-[20px]'>
            <div className='px-[24px] py-[20px]'>
              <Form layout='vertical' onFinish={onCreateSmartDevice}>
                <div className='flex items-center mb-[15px] gap-[24px]'>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item label='Nhập tên sản phẩm' name='deviceName'>
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input product name'
                        ></Input>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full '>
                    <div className='mb-[8px]'>
                      <Form.Item label='Chọn nhà sản xuất' name='manuId'>
                        <Select
                          placeholder='Select manufacture'
                          style={{
                            width: '100%',
                          }}
                          open={open}
                          onDropdownVisibleChange={(visible) =>
                            setOpen(visible)
                          }
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
                      <Form.Item label='Nhập giá sản phẩm' name='price'>
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input product price'
                        ></Input>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item label='Nhập giá cài đặt' name='installPrice'>
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input installation price'
                        ></Input>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-[8px]'>
                      <Form.Item label='Nhập loại thiết bị' name='typeDevice'>
                        <Input
                          className='rounded-[4px] w-full px-[15px] pt-[8px] pb-[10px] font-poppin font-normal text-[13px] outline-none border border-[#CED4DA]'
                          required
                          placeholder='Input devices type'
                        ></Input>
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
                          placeholder='Input description'
                        ></TextArea>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    if(checkFileType(acceptedFiles)){
                      handleAcceptedFiles(acceptedFiles);
                    } else{
                      messageApi.error({
                        type: 'error',
                        content: 'Vui lòng chọn file là ảnh'
                      })
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
                          {selectedFile ? (
                            <img
                              src={selectedFile?.preview}
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

                          {selectedFile ? (
                            ''
                          ) : (
                            <h4>Drop files here or click to upload.</h4>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <div className='flex justify-end gap-[8px] '>
                  <Button
                    loading={createSmartDevices}
                    type='primary'
                    htmlType='submit'
                    className='rounded-[4px] mt-[20px] text-white px-[15.5px] text-[13px] font-normal bg-[#364574]'
                  >
                    Tạo sản phẩm
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
