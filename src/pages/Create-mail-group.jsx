import React, { useState } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import appFirebase from '../services/credentials';
import {getAuth, signAuth} from 'firebase/auth';


const CreateMailGroup=()=>{
    return(
        <div>
        <SidebarAdmin/>
        </div>



    );

}
export default CreateMailGroup;