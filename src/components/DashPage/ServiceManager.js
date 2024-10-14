import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Dash.css';

Modal.setAppElement('#root'); // Set the app root element for accessibility

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ heading: '', description: '', description2: '', description3: '', images: [] });
    const [editService, setEditService] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/service'); // Replace with your API endpoint
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleAddService = async () => {
        if (newService.heading && newService.description && newService.description2 && newService.description3 && newService.images.length > 0) {
            try {
                const response = await axios.post('/service', newService);
                setServices([...services, response.data]);
                setNewService({ heading: '', description: '',description2: '', description3: '', images: [] });
                setIsAddModalOpen(false);
                alert('Service added successfully!');
            } catch (error) {
                console.error('Error adding service:', error);
            }
        } else {
            alert('Please fill out all fields and upload at least one image.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/service/${id}`); // Replace with your API endpoint
            setServices(services.filter(service => service.id !== id));
            alert('Service deleted successfully!');
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleEdit = (id) => {
        const serviceToEdit = services.find(service => service.id === id);
        setEditService(serviceToEdit);
        setIsEditModalOpen(true);
    };

    const handleUpdateService = async () => {
        if (editService.heading && editService.description && editService.description2 && editService.description3 && editService.images.length > 0) {
            try {
                const response = await axios.put(`/service/${editService.id}`, editService);
                setServices(services.map(service => service.id === editService.id ? response.data : service));
                setEditService(null);
                setIsEditModalOpen(false);
                alert('Service updated successfully!');
            } catch (error) {
                console.error('Error updating service:', error);
            }
        } else {
            alert('Please fill out all fields and upload at least one image.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService({ ...newService, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditService({ ...editService, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Append the new image to the images array
                setNewService(prevState => ({
                    ...prevState,
                    images: [...prevState.images, reader.result.split(',')[1]] // Use base64 image string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Append the new image to the images array
                setEditService(prevState => ({
                    ...prevState,
                    images: [...prevState.images, reader.result.split(',')[1]] // Use base64 image string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle deleting individual images in the edit modal
    const handleDeleteImage = (index) => {
        setEditService(prevState => ({
            ...prevState,
            images: prevState.images.filter((_, imgIndex) => imgIndex !== index)
        }));
    };

    return (
        <div className="table-container">
            <h1>Service Manager</h1>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add New Service</button>

            <table>
                <thead>
                    <tr>
                        <th>Heading</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.id}>
                            <td>{service.heading}</td>
                            <td>{service.description}</td>
                            <td>
                                <button onClick={() => handleEdit(service.id)} className="btn-edit-item">Edit</button>
                                <button onClick={() => handleDelete(service.id)} className="btn-delete-item">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Service Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                contentLabel="Add Service"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Add New Service</h2>
                <input
                    type="text"
                    name="heading"
                    placeholder="Heading"
                    value={newService.heading}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={newService.description}
                    onChange={handleInputChange}
                    rows={4} // Adjust rows as needed
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                />

                <textarea
                    name="description2"
                    placeholder="Additional Description 2"
                    value={newService.description2}
                    onChange={handleInputChange}
                    rows={4} // Adjust rows as needed
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                />
                <textarea
                    name="description3"
                    placeholder="Additional Description 3"
                    value={newService.description3}
                    onChange={handleInputChange}
                    rows={4} // Adjust rows as needed
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button onClick={handleAddService}>Add Service</button>
                <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            </Modal>

            {/* Edit Service Modal */}
            {editService && (
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    contentLabel="Edit Service"
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <h2>Edit Service</h2>
                    <input
                        type="text"
                        name="heading"
                        placeholder="Heading"
                        value={editService.heading}
                        onChange={handleEditInputChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={editService.description}
                        onChange={handleEditInputChange}
                        rows={4}
                        style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                    />

                    <textarea
                        name="description2"
                        placeholder="Additional Description 2"
                        value={editService.description2}
                        onChange={handleEditInputChange}
                        rows={4}
                        style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <textarea
                        name="description3"
                        placeholder="Additional Description 3"
                        value={editService.description3}
                        onChange={handleEditInputChange}
                        rows={4}
                        style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                    />
                    <div>
                        {editService.images.map((image, index) => (
                            <div key={index}>
                                <img src={`data:image/png;base64,${image}`} alt={`Service for ${editService.heading}`} style={{ width: '100px', height: '100px' }} />
                                <button onClick={() => handleDeleteImage(index)}>Delete Image</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleUpdateService}>Update Service</button>
                    <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default ServiceManager;
