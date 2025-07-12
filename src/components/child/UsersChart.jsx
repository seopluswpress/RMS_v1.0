import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsersChart = () => {
  const [users, setUsers] = useState([
    { username: "tenantuser1", type: "tenant" },
    { username: "manageruser1", type: "property_manager" },
    { username: "tenantuser2", type: "tenant" }
  ]);

  return (
    <div className='col-6 col-md-6 w-100'>
      <div className='card w-100'>
        <div className='card-header border-bottom'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between w-100'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Users</h6>
          </div>
        </div>
        <div className='card-body p-20'>
          <div className='d-flex flex-column gap-24 '>
            {users.map((user, index) => (
              <div key={index} className='d-flex align-items-center justify-content-between gap-3'>
                <div className='d-flex align-items-center'>
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.username}`}
                    alt='avatar'
                    className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0'>{user.username}</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {user.type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                <span className='text-success-main fw-medium text-md'>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersChart;
