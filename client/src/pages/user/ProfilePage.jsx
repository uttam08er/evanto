import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userAPI, authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiCamera, FiLock, FiShield, FiCheck } from "react-icons/fi";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [tab, setTab] = useState("profile");

  const { register, handleSubmit, formState:{errors} } = useForm({ defaultValues:{ name:user?.name, phone:user?.phone } });
  const { register:rPwd, handleSubmit:hPwd, watch:wPwd, reset:resetPwd, formState:{errors:ePwd} } = useForm();

  const onProfile = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      if (data.phone) fd.append("phone", data.phone);
      const fi = document.getElementById("pfImg");
      if (fi?.files[0]) fd.append("profileImage", fi.files[0]);
      const { data:res } = await userAPI.updateProfile(fd);
      updateUser(res.user);
      toast.success("Profile updated!");
    } catch (e) { toast.error(e.response?.data?.message||"Update failed"); } finally { setLoading(false); }
  };

  const onPassword = async (data) => {
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword:data.cur, newPassword:data.newp });
      toast.success("Password changed!"); resetPwd();
    } catch (e) { toast.error(e.response?.data?.message||"Failed"); } finally { setLoading(false); }
  };

  const ROLE_C = { user:"bg-violet-100 text-violet-700", owner:"bg-blue-100 text-blue-700", admin:"bg-rose-100 text-rose-700" };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile and security</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <img src={preview||user?.profileImage||`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"U")}&background=7c3aed&color=fff&size=96`}
              alt="" className="w-20 h-20 rounded-2xl object-cover"/>
            <label htmlFor="pfImg" className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary-600 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-700 shadow-md">
              <FiCamera size={13}/>
            </label>
            <input id="pfImg" type="file" accept="image/*" className="hidden"
              onChange={e=>e.target.files[0]&&setPreview(URL.createObjectURL(e.target.files[0]))}/>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${ROLE_C[user?.role]}`}>{user?.role}</span>
              {user?.isVerified&&<span className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium"><FiCheck size={10}/>Verified</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 gap-1">
        {[{id:"profile",icon:FiUser,label:"Profile Info"},{id:"password",icon:FiLock,label:"Password"},{id:"security",icon:FiShield,label:"Security"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
              ${tab===t.id?"bg-primary-600 text-white shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
            <t.icon size={14}/><span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {tab==="profile"&&(
          <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                <input className={`input-field pl-9 ${errors.name?"border-rose-400":""}`}
                  {...register("name",{required:"Name is required",minLength:{value:2,message:"Min 2 chars"}})}/></div>
              {errors.name&&<p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(cannot change)</span></label>
              <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                <input value={user?.email} disabled className="input-field pl-9 bg-gray-50 cursor-not-allowed text-gray-500"/></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                <input className="input-field pl-9" placeholder="10-digit number"
                  {...register("phone",{pattern:{value:/^[0-9]{10}$/,message:"Enter valid 10-digit number"}})}/></div>
              {errors.phone&&<p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading?"Saving...":"Save Changes"}
            </button>
          </form>
        )}

        {tab==="password"&&(
          <form onSubmit={hPwd(onPassword)} className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
            {[{id:"cur",label:"Current Password",rules:{required:"Required"}},
              {id:"newp",label:"New Password",rules:{required:"Required",minLength:{value:6,message:"Min 6 chars"}}},
              {id:"conf",label:"Confirm New Password",rules:{required:"Required",validate:v=>v===wPwd("newp")||"Passwords don't match"}}].map(f=>(
              <div key={f.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                  <input type="password" className={`input-field pl-9 ${ePwd[f.id]?"border-rose-400":""}`} {...rPwd(f.id,f.rules)}/></div>
                {ePwd[f.id]&&<p className="text-rose-500 text-xs mt-1">{ePwd[f.id].message}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading?"Changing...":"Change Password"}
            </button>
          </form>
        )}

        {tab==="security"&&(
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Security Overview</h3>
            {[
              {icon:"✅",label:"Email Verified",status:user?.isVerified?"Yes":"No",ok:user?.isVerified},
              {icon:"🔐",label:"Password Protected",status:"Active",ok:true},
              {icon:"🛡",label:"Account Status",status:user?.isBlocked?"Blocked":"Active",ok:!user?.isBlocked},
              {icon:"👤",label:"Account Role",status:user?.role,ok:true},
            ].map(s=>(
              <div key={s.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{s.label}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${s.ok?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
