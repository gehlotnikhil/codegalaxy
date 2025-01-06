import React from 'react'
import { useContext, useRef, useState } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Profile() {
 


  
  
    function handleChange(e:any): void {
        throw new Error('Function not implemented.');
    }

    function handleClose(e:any): void {
        throw new Error('Function not implemented.');
    }

    function handleShow(e:any): void {
        throw new Error('Function not implemented.');
    }

  return (
    <>
      <section className='color-1' >
        <div className="container py-2" style={{  }}>
          <div className="row" >
            <div className="col-lg-4">
              <div className="card mb-4" style={{ paddingBottom: "1.07pc" }}>
                <div className="card-body text-center">
                  <img src={"./blank-profile.png"} alt="avatar"
                    className=" img-fluid" style={{ borderRadius: "1rem", width: "150px" }} />
                  <h5 className="my-3">Nikhil</h5>
                  <p className="text-muted mb-1">gehlotnikhil</p>
                  <Button style={{marginTop:"19px"}} variant="primary" onClick={handleShow}>
                    Edit Profile
                  </Button>
                </div>
              </div>

            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">Nikhil</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Username: </p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">gehlotnikhil</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">gehlotnikhil@gmail.com</p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Mobile</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">123456789</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">Mumbai</p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Instituation</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">R J College</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </section>
    </>
  )
}

export default Profile