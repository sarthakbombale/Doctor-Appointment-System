import React, { useEffect, useState } from 'react'
import { getLoggedUser } from '../api/userAPI'

const Profile = () => {
  const [ user,setUSer] = useState()
  async function fetchData(){
      const res = await getLoggedUser()
      if(res.data.success){
        setUSer(res.data.user)
      }
  }
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <>
      <h1>Profile</h1>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className='p-4'>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
            </div>
          </div>
          <div className="col">
            <img src={`${user?.imagePath}`} alt={user?.name} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile