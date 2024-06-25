// import axios from "axios"
// import './User.css'
// import { useState, useEffect } from "react"
// import { MdEdit } from "react-icons/md";
// import { FaTrashAlt } from "react-icons/fa";
// import { FaPager } from "react-icons/fa6";

// const User = () => {
//     const [user, setUser] = useState([])
//     const [modal , setModal] = useState(false)

//     useEffect(() =>  {
//         axios
//             .get("http://localhost:3000/users")
//             .then(res => {
//                 if(res.status === 200){
//                     setUser(res.data)
//                 }
//                 console.log(res);
//             })
//     },[])


//   return (
//     <>
//     <div className="container">
//         <h1 className="text-center my-3">User</h1>
//         <button className="btn btn-success my-3" onClick={() => setModal(true)}>Add user</button>
//         <table className="table table-bordered table-hover table-strip">
//             <thead>
//                 <tr>
//                     <th>T/R</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Number</th>
//                     <th>Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {
//                     user?.map((item, index) => (
//                         <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{item.name}</td>
//                             <td>{item.email}</td>
//                             <td>{item.number}</td>
//                             <td className="images"><MdEdit style={{color: "blue", fontSize: "25"}}/>   <FaTrashAlt style={{color: "red", fontSize: "25"}}/>  <FaPager style={{color: "indigo", fontSize: "25"}}/>   </td>
//                         </tr>
//                     ))
//                 }
//             </tbody>
//         </table>
//     </div>
        
//     </>
//   )
// }

// export default User


import axios from "axios";
import './User.css';
import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaPager } from "react-icons/fa6";

const User = () => {
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: "", email: "", number: "" });
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/users")
            .then(res => {
                if (res.status === 200) {
                    setUsers(res.data);
                }
            });
    }, []);

    const handleAddOrEdit = () => {
        if (isEdit) {
            axios.put(`http://localhost:3000/users/${selectedUserId}`, currentUser)
                .then(res => {
                    if (res.status === 200) {
                        setUsers(users.map(user => user.id === selectedUserId ? res.data : user));
                        closeModal();
                    }
                });
        } else {
            axios.post("http://localhost:3000/users", currentUser)
                .then(res => {
                    if (res.status === 201) {
                        setUsers([...users, res.data]);
                        closeModal();
                    }
                });
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setSelectedUserId(user.id);
        setIsEdit(true);
        setModal(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/users/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setUsers(users.filter(user => user.id !== id));
                }
            });
    };

    const closeModal = () => {
        setCurrentUser({ name: "", email: "", number: "" });
        setIsEdit(false);
        setModal(false);
    };

    return (
        <>
            <div className="container">
                <h1 className="text-center my-3">User</h1>
                <button className="btn btn-success my-3" onClick={() => setModal(true)}>Add user</button>
                <table className="table table-bordered table-hover table-strip">
                    <thead>
                        <tr>
                            <th>T/R</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.number}</td>
                                <td className="images">
                                    <MdEdit style={{ color: "blue", fontSize: "25" }} onClick={() => handleEdit(item)} />
                                    <FaTrashAlt style={{ color: "red", fontSize: "25" }} onClick={() => handleDelete(item.id)} />
                                    <FaPager style={{ color: "indigo", fontSize: "25" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{isEdit ? "Edit User" : "Add User"}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddOrEdit(); }}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    required
                                    type="text"
                                    value={currentUser.name}
                                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    required
                                    type="email"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Number</label>
                                <input
                                    required
                                    type="text"
                                    value={currentUser.number}
                                    onChange={(e) => setCurrentUser({ ...currentUser, number: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">{isEdit ? "Update" : "Add"}</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default User;
