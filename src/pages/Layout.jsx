import { BreadCrumb } from "../components/BreadCrumb";
import { MainHeader } from "../components/Header";
import { AssignStaff } from "./AssignStaff";


export function Layout() {
    return (
      <div className="overscroll-y-auto">
        <MainHeader />
        <AssignStaff />
      </div>
    );
  }
  