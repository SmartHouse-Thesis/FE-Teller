import { Icon } from '@iconify/react';
import usa_flag from '../../../public/image/flag_usa.png'
import avatar from '../../../public/image/user.png'
import { BreadCrumb } from '../BreadCrumb';
import { SearchInput } from '../SearchInput';
import { jwtDecode } from 'jwt-decode';
import userLoginApi from '../../api/user';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
export function MainHeader() {
  const userDecode = localStorage.getItem('accessToken');
  const userInfo = jwtDecode(userDecode);

  const [user, setUser] = useState();
  const { isPending: userLoginPending, mutate } = useMutation({
    mutationFn: () => userLoginApi.getUserInfo(),
    onSuccess: (response) => {
      console.log(response);
      setUser(response);
    },
    onError: () => {
      messageApi.open({
        type: 'error',
        content: 'Error occur when get user',
      });
    },
  });
  useEffect(() => {
    mutate();
  }, []);

  return (
    <>
      <div className='h-[70px] bg-white border-b border-[#F3F3F9] flex items-center justify-between'>
        <div className='pl-[27px] pr-[24px] flex items-center justify-end w-full'>
          <div className='flex items-center gap-[24px]'>
            <div className='flex gap-[13px] bg-[#F3F3F9] py-[16px] px-[15px]'>
                <img src={user?.avatar ? user?.avatar : avatar} alt="" className='w-[32px] h-[32px] rounded-[100%]'/>
                <div className='flex flex-col'>
                    <span className='font-poppin font-normal text-[13px] text-[#212529]'>{user?.fullName}</span>
                    <span className='font-poppin font-normal text-[12px] text-[#9599AD]'>{user?.roleName}</span>
                </div>
            </div>
          </div>
        </div>
        
      </div>
  
    </>
  );
}
