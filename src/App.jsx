import { SignIn } from './pages/SignIn';
import './index.css';
import '../public/css/index.css';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Logout } from './pages/Logout';
import { Admin } from './layout/Admin';
import { Layout } from './pages/Layout';
import { Sidebar } from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ConstructionPage } from './pages/ConstructionPage';
import { DevicePage } from './pages/DevicePage';
import { PromotionPage } from './pages/PromotionPage';
import { AssignStaff } from './pages/AssignStaff';
import { ProfileLayout } from './layout/ProfileLayout';
import { ProfileDetail } from './pages/ProfileDetail';
import { ChangePassword } from './pages/ChangePassword';
import { NewContract } from './pages/NewContract';
import { DepositPage } from './pages/DepositPage';
import { DoingConstruction } from './pages/DoingConstruction';
import { DoneConstruction } from './pages/DoneConstruction';
import { CreateDevice } from './pages/CreateDevice';
import { PackagePage } from './pages/PackagePage';
import { AddProduct } from './pages/AddProduct';
import { Manufacture } from './pages/Manufacture';
import { UpdateDevice } from './pages/UpdateDevice';
import { UpdatePackage } from './pages/UpdatePackage';
import { StaffPage } from './pages/StaffPage';
import { Staff } from './pages/Staff';
import { StaffLead } from './pages/StaffLead';
import Chat from './pages/Chat';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/reset-password' element={<ForgotPassword />} />
        <Route path='/log-out' element={<Logout />} />
        <Route element={<Admin />}>
          <Route element={<ConstructionPage />}>
            <Route path='/construction' element={<NewContract />} />
            <Route path='/construction/deposit' element={<DepositPage />} />
            <Route path='/construction/doing' element={<DoingConstruction />} />
            <Route
              path='/construction/project-done'
              element={<DoneConstruction />}
            />
          </Route>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/device-page' element={<DevicePage />} />
          <Route path='/device-page/add-product' element={<AddProduct />} />
          <Route
            path='/device-page/update-device/:id'
            element={<UpdateDevice />}
          />
          <Route path='/package-page' element={<PackagePage />} />
          <Route
            path='/package-page/create-device'
            element={<CreateDevice />}
          />
          <Route
            path='/package-page/update-package/:id'
            element={<UpdatePackage />}
          />

          <Route path='/promotion' element={<PromotionPage />} />
          <Route element={<StaffPage />}>
          <Route path='/assign-staff' element={<AssignStaff />} />
            <Route path='/staff' element={<Staff />} />
            <Route path='/staff-lead' element={<StaffLead />} />
            <Route
              path='/construction/project-done'
              element={<DoneConstruction />}
            />
          </Route>

          <Route path='/manufacture' element={<Manufacture />} />
          <Route element={<ProfileLayout />}>
            <Route path='/profile' element={<Chat />} />
            <Route path='/change-password' element={<ChangePassword />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
