import { Icon } from '@iconify/react';
import productImg from '../../public/image/clother.png';
import user from '../../public/image/user.png';
import { Pagination } from '../components/Pagination';
import { BreadCrumb } from '../components/BreadCrumb';
import { SearchInput } from '../components/SearchInput';
import { Link, NavLink, Outlet } from 'react-router-dom';

export function StaffPage() {
  return (
    <>
 
      <div className='px-[24px] pt-[24px]'>
        <div className='bg-[white]  pt-[20px] pb-[16px] '>
          <div className='flex items-center justify-between px-[14px] '>
            <span className='text-[#495057] font-poppin font-medium text-[16px]'>
              Danh sách nhân viên
            </span>
          </div>
          <div className='mb-[15px] border-b border-[#E9EBEC] flex items-center justify-start'>

            <Link to='/assign-staff' className='py-[16px] px-[20px]'>
              <span className='text-[#405189] font-poppin font-medium text-[13px]'>
                {' '}
                Teller{' '}
              </span>
            </Link>
            <Link to='/staff' className='py-[16px] px-[20px]'>
              <span className='text-[#405189] font-poppin font-medium text-[13px]'>
                {' '}
                Staff
              </span>
            </Link>
            <Link to='/staff-lead' className='py-[16px] px-[20px]'>
              <span className='text-[#405189] font-poppin font-medium text-[13px]'>
                {' '}
                Leader Staff
              </span>
            </Link>

          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
