import React, { useEffect, useState } from "react";
import "./Todo.css";

const apiUrl = "https://todo-backend-dhta.onrender.com";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(apiUrl + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(() => console.log("Error fetching todos"));
  }, []);

  // Add
  const handleAdd = async () => {
    if (!title.trim() || !description.trim()) return;

    const res = await fetch(apiUrl + "/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });

    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);

    setTitle("");
    setDescription("");
    setMessage("Item added successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  // Start edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  // Update
  const handleUpdate = async () => {
    const res = await fetch(`${apiUrl}/todos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription
      })
    });

    const updated = await res.json();

    const updatedTodos = todos.map(item =>
      item._id === editId ? updated : item
    );

    setTodos(updatedTodos);
    setEditId(null);
    setMessage("Item updated successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    await fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" });

    setTodos(todos.filter(item => item._id !== id));
  };


  return (
    <div className="container">
      <h1>Todo Manager</h1>

      {message && <p className="success">{message}</p>}

      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button className="btn primary" onClick={handleAdd}>
          Add
        </button>
      </div>

      <h2>Tasks</h2>

      {todos.map(item => (
        <div key={item._id} className="card">

          {editId === item._id ? (
            <>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
              <input
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />

              <div className="actions">
                <button className="btn primary" onClick={handleUpdate}>
                  Save
                </button>
                <button className="btn secondary" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="actions">
                <button
                  className="btn warning"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="btn danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );


}

// import { useEffect, useState } from "react"

// export default function Todo() {

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [todos, setTodos] = useState([]);
//     const [error, setError] = useState("");
//     const [message, setMessage] = useState("Item added successfully");
//     const [editId, setEditId] = useState(-1);

//     const [editTitle, setEditTitle] = useState("");
//     const [editDescription, setEditDescription] = useState("");


//     const apiUrl = "http://localhost:8000"

//     const handleSubmit = () => {
//         //Check inputs
//         if (title.trim() !== '' && description.trim() !== '') {
//             fetch(apiUrl + "/todos", {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ title, description })
//             })
//                 .then((newTodo) => {
//                     setTodos([...todos, newTodo]);
//                     setTitle("");
//                     setDescription("");
//                     setMessage("Item added successfully");

//                     setTimeout(() => {
//                         setMessage("");
//                     }, 3000);
//                 })
//                 .catch(() => {
//                     setError("Unable to create Todo item");
//                 });}}


//             useEffect(() => {
//                 getItems()
//             }, [])
//             const getItems = () => {
//                 fetch(apiUrl + "/todos")
//                     .then((res) => res.json())
//                     .then((res) => {
//                         setTodos(res)
//                     })
//             }

//             const handleEdit = (item) => {
//                 setEditId(item._id);
//                 setEditTitle(item.title);
//                 setEditDescription(item.description)
//             }

//             const handleUpdate = () => {
//                 if (editTitle.trim() !== '' && editDescription.trim() !== '') {
//                     fetch(apiUrl + "/todos/" + editId, {
//                         method: "PUT",
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({ title: editTitle, description: editDescription })
//                     }).then((res) => {
//                         if (res.ok) {
//                             //Update item to list
//                             const updatedTodos = todos.map((item) =>
//                                 item._id === editId
//                                     ? { ...item, title: editTitle, description: editDescription }
//                                     : item
//                             );


//                             // const updatedTodos = todos.map((item) => {
//                             //     if (item._id === editId) {
//                             //         item.title = editTitle;
//                             //         item.description = editDescription;
//                             //     }
//                             //     return item;
//                             // })
//                             setTodos(updatedTodos)
//                             setEditTitle("");
//                             setEditDescription("");
//                             setMessage("Item updated successfully")
//                             setTimeout(() => {
//                                 setMessage("");

//                             }, 3000)
//                             setEditId(-1)

//                         } else {
//                             //set error
//                             setError("Unable to update Todo item")
//                         }
//                     }).catch(() => {
//                         setError("Unable to update Todo item")
//                     })
//                 }
//             }
//             const handleEditCancel = () => {
//                 setEditId(-1)
//             }

//             const handleDelete = (id) => {
//                 if (window.confirm('Are you sure want to delete')) {
//                     fetch(apiUrl + '/todos/' + id, {
//                         method: "DELETE"
//                     })
//                         .then(() => {
//                             const updatedTodos = todos.filter((item) => item._id !== id)
//                             setTodos(updatedTodos)
//                         })
//                 }


//             }


//             return <>
//                 <div className="row p-3 bg-success text-light">
//                     <h1>Todo List </h1>
//                 </div>
//                 <div className="row">
//                     <h3>Add Item</h3>
//                     {message && <p className="text-success">{message}</p>}

//                     <div className="form-group d-flex gap-2">
//                         <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text"></input>
//                         <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text"></input>
//                         <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
//                     </div>
//                     {error && <p className="text-danger">{error}</p>}
//                 </div>

//                 <div className="row mt-3">
//                     <h3>Tasks</h3>
//                     <div className="col-md-6"><ul className="list-group">
//                         {
//                             todos.map((item) => <li className="list-group-item d-flex justify-content-between align-items-center my-2">
//                                 <div className="d-flex flex-column me-2">
//                                     {
//                                         editId === -1 || editId !== item._id ? <>
//                                             <span className="fw-bold">{item.title}</span>
//                                             <span>{item.description}</span>
//                                         </> : <>

//                                             <div className="form-group d-flex gap-2">
//                                                 <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"></input>
//                                                 <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"></input>
//                                             </div>
//                                         </>
//                                     }

//                                 </div>

//                                 <div className="d-flex gap-2">
//                                     {editId === -1 ?
//                                         <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={() => handleUpdate()}>Update</button>}
//                                     {editId === -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
//                                         <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}

//                                 </div>
//                             </li>)
//                         }


//                     </ul></div>
//                 </div>
//             </>
//         }