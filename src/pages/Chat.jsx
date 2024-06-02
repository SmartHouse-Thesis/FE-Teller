import { useCallback } from 'react';
import Talk from 'talkjs';
import { Session, Chatbox, Inbox } from '@talkjs/react';

export function Chat() {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: 'staff2',
        name: 'Minh Hoang',
        email: 'nani@example.com',
        photoUrl: 'https://talkjs.com/new-web/avatar-7.jpg',
        welcomeMessage: 'Hi!',
      }),
    []
  );
  const syncConversation = useCallback((session) => {
    // JavaScript SDK code here
    const conversation = session.getOrCreateConversation(Talk.oneOnOneId('staff2', 'nguyenla'));


    conversation.setParticipant(session.me);
    // conversation.setParticipant(other);

    return conversation;
  }, []);

  return (
    <Session appId='trYfckWX' syncUser={syncUser}>
      <Inbox
        syncConversation={syncConversation}
        style={{ width: '100%', height: '500px' }}
      ></Inbox>
    </Session>
  );
}

export default Chat;

// import { SearchInput } from '../components/SearchInput';
// import avatar1 from '/image/avatar1.png';
// import bgChat from '/image/bg-chat.png';
// export function Chat() {
//   return (
//     <>
//       <div className='h-[calc(100vh_-_70px)] overflow-hidden'>
//         <div className='grid grid-cols-[3fr_13fr] gap-[4px] pt-[4px] pl-[4px] h-screen overflow-hidden'>
//           <div className='px-[24px] py-[21px] bg-[#FFFFFF]'>
//             <div className='flex justify-between items-center mb-[20px]'>
//               <span className='font-poppin font-medium text-[16px]'>Chats</span>
//               <span className='text-[#0AB39C] px-[10px] py-[6px] bg-[#c4f2ec]'>
//                 +
//               </span>
//             </div>
//             <SearchInput />
//             <div className='flex justify-between items-center mt-[20px] mb-[10px]'>
//               <span className='font-poppin text-[11px]'>Direct message</span>
//               <span className='text-[#0AB39C] px-[10px] py-[6px] bg-[#c4f2ec]'>
//                 +
//               </span>
//             </div>
//             <div className=''>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Lisa Parker
//                   </span>
//                 </div>
//                 <span className='text-[#212529] rounded-[4px] text-[10px] inline-block px-[4px] py-[2px] bg-[#a1a7ad]'>
//                   8
//                 </span>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Frank Thomas
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Clifford Taylor
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Janette Caster
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Lisa Parker
//                   </span>
//                 </div>
//                 <span className='text-[#212529] rounded-[4px] text-[10px] inline-block px-[4px] py-[2px] bg-[#a1a7ad]'>
//                   8
//                 </span>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Sarah Beattie
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Nellie Cornett
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Edith Evans
//                   </span>
//                 </div>
//               </div>
//               <div className='flex items-center justify-between mb-[14px]'>
//                 <div className='flex items-center gap-[8px]'>
//                   <img src={avatar1} alt='' className='w-[24px] h-[24px]' />
//                   <span className='text-[#212529] font-poppin text-[13px]'>
//                     Joseph Siegel
//                   </span>
//                 </div>
//               </div>
//               <div className='flex justify-between items-center mt-[20px] mb-[10px]'>
//                 <span className='font-poppin text-[11px]'>CHANNELS</span>
//                 <span className='text-[#0AB39C] px-[10px] py-[6px] bg-[#c4f2ec]'>
//                   +
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div
//             className='relative h-screen'
//             style={{
//               width: '100%',
//               height: '',
//               backgroundImage: `url(${bgChat})`,
//               backgroundSize: 'cover',
//             }}
//           >
//             <div className='pt-[13px] pl-[16px] pb-[18px] pr-[26px] bg-white'>
//               <div className='flex items-center gap-[10px]'>
//                 <img src={avatar1} alt='' className='w-[32px] h-[32px]' />
//                 <div className='flex flex-col'>
//                   <span className='font-poppin font-medium text-[16px]'>
//                     Lisa Parker
//                   </span>
//                   <span className='font-poppin font-normal text-[13px] text-[#9599AD]'>
//                     Online
//                   </span>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
