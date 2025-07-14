import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchBankAccountMap } from '../utils/bankAccountMap';
import {
  FiHome,
  FiPlus,
  FiMapPin,
  FiUser,
  FiRefreshCw,
  FiFileText,
  FiDollarSign,
  FiUpload,
  FiEdit2,
} from 'react-icons/fi';
import { Icon } from '@iconify/react';
import axiosInstance from '../utils/axiosInstance';
import PropertyForm from '../Forms/PropertyForm';
import UnitAdd from '../Forms/UnitAdd';
import LeaseForm from '../Forms/LeaseForm';
import InvoiceForm from '../Forms/InvoiceForm';
import { getFirstBankAccountForUser} from '../utils/bankAccountMap'

function Modal({ children, onClose }) {
  // Close modal on background click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={handleOverlayClick}>
      <div style={{
        background: '#fff', borderRadius: '12px', boxShadow: '0 2px 24px rgba(0,0,0,0.2)',
        minWidth: 350, maxWidth: '95vw', width: 500, maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: 0
      }}>

        <div style={{ padding: '24px 16px 16px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Properties() {
  // ...existing state...
  const [showBankAccountForm, setShowBankAccountForm] = useState(false);
  const [bankAccountForm, setBankAccountForm] = useState({
    payment_type: 'Stripe',
    stripe_secret_key: '',
    stripe_publishable_key: '',
    paypal_client_id: '',
    paypal_secret_key: '',
  });
  const [showScreeningLinkModal, setShowScreeningLinkModal] = useState(false);
  const [screeningLinkData, setScreeningLinkData] = useState(null);
  const [screeningLinkLoading, setScreeningLinkLoading] = useState(false);
  const [screeningLinkError, setScreeningLinkError] = useState(null);
  const [screeningToggleLoading, setScreeningToggleLoading] = useState(false);
  const [bankAccountLoading, setBankAccountLoading] = useState(false);
  const [bankAccountError, setBankAccountError] = useState(null);
  const [bankAccountSuccess, setBankAccountSuccess] = useState(null);
  // --- Bank Account Map ---
  const [bankAccountMap, setBankAccountMap] = useState({});
  const [bankAccountMapLoading, setBankAccountMapLoading] = useState(false);
  const [bankAccountMapError, setBankAccountMapError] = useState(null);
  // --- Units Modal ---
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [selectedUnitsProperty, setSelectedUnitsProperty] = useState(null);
  const handleInitiateScreeningClick = async () => {
    setShowScreeningLinkModal(true);
    setScreeningLinkLoading(true);
    setScreeningLinkError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('https://hemanth525.pythonanywhere.com/screening/generate-link/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === 1) {
        setScreeningLinkData({ url: data.url, token: data.token, active: data.active });
      } else {
        setScreeningLinkError(data.error || 'Failed to generate link');
      }
    } catch (err) {
      setScreeningLinkError('Failed to generate link');
    } finally {
      setScreeningLinkLoading(false);
    }
  };
  const handleToggleScreeningLink = async () => {
    setScreeningToggleLoading(true);
    setScreeningLinkError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('https://hemanth525.pythonanywhere.com/screening/toggle-link/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === 1) {
        setScreeningLinkData((prev) => ({ ...prev, active: data.active }));
      } else {
        setScreeningLinkError(data.error || 'Failed to update link status');
      }
    } catch (err) {
      setScreeningLinkError('Failed to update link status');
    } finally {
      setScreeningToggleLoading(false);
    }
  };

  // Handle changes in form fields
  const handleBankAccountChange = (e) => {
    const { name, value } = e.target;
    setBankAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleBankAccountSubmit = async (e) => {
    e.preventDefault();
    setBankAccountLoading(true);
    setBankAccountError(null);
    setBankAccountSuccess(null);
    try {
      // Retrieve access token for Authorization header
      const access = localStorage.getItem("access");
      if (!access) {
        setBankAccountError("User not authenticated. Please log in again.");
        setBankAccountLoading(false);
        return;
      }
      // Robust userId extraction from localStorage
      let userId = null;
      try {
        const userObj = JSON.parse(localStorage.getItem("user"));
        userId = userObj?.user_id || userObj?.id || null;
      } catch {
        userId = null;
      }
      console.log("userId from localStorage user object:", userId);
      if (!userId) {
        setBankAccountError("User not logged in. Please log in again.");
        setBankAccountLoading(false);
        return;
      }
      // Compose payload with only relevant fields
      let payload = {
        payment_type: bankAccountForm.payment_type,
        property_id: selectedProperty?.property_id || selectedProperty?.id,
        user_id: userId,
      };
      console.log("Bank account payload:", payload);
      
      // Optional: Add unit/lease if selected
      if (selectedUnit) {
        payload.unit_id = selectedUnit.unit_id || selectedUnit.id;
      }
      if (selectedUnit?.lease_id) {
        payload.lease_id = selectedUnit.lease_id;
      }
      
      // STRIPE fields
      if (bankAccountForm.payment_type === 'Stripe') {
        payload.stripe_secret_key = bankAccountForm.stripe_secret_key;
        payload.stripe_publishable_key = bankAccountForm.stripe_publishable_key;
      }
      
      // PAYPAL fields — IMPORTANT 
      if (bankAccountForm.payment_type === 'Paypal') {
        payload.paypal_client_id = bankAccountForm.paypal_client_id;
        payload.paypal_secret_key = bankAccountForm.paypal_secret_key;
      }
      
      // Make API request (replace with your endpoint)
      const response = await fetch("https://hemanth525.pythonanywhere.com/accounts/bank-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}` // Use access token for authentication
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setBankAccountSuccess('Bank account added successfully!');
      await fetchAndSetBankAccountMap(); // Refresh bank account map
      console.log('Bank account map after add:', bankAccountMap);
      setShowBankAccountForm(false);
      setBankAccountForm({
        payment_type: 'Stripe',
        stripe_secret_key: '',
        stripe_publishable_key: '',
        paypal_client_id: '',
        paypal_secret_key: '',
      });
    } catch (err) {
      console.error("API error:", err.response?.data || err); 
      setBankAccountError(
        (err.response && JSON.stringify(err.response.data)) ||
        err.message ||
        'Failed to add bank account'
      );
    } finally {
      setBankAccountLoading(false);
    }
  };

  // --- MAIN HEADING AND ADD BUTTON ---
  // We'll inject these at the top of the returned JSX below.
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [expandedProperties, setExpandedProperties] = useState(new Set());
  const [showLeaseForm, setShowLeaseForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [leaseList, setLeaseList] = useState([]);
  const [leaseError, setLeaseError] = useState(null);


  const fetchPropertiesWithUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching properties and units...');
  
      const token = localStorage.getItem("access");
      const [propertiesRes, unitsRes] = await Promise.all([
        fetch("https://hemanth525.pythonanywhere.com/properties/property_list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then(res => res.json()),
        fetch("https://hemanth525.pythonanywhere.com/properties/unit/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then(res => res.json()),
      ]);

      console.log('Properties response:', propertiesRes);
      console.log('Units response:', unitsRes);

      let propertiesData = [];
      if (propertiesRes) {
        if (Array.isArray(propertiesRes)) {
          propertiesData = propertiesRes;
        } else if (Array.isArray(propertiesRes.data)) {
          propertiesData = propertiesRes.data;
        } else if (Array.isArray(propertiesRes.results)) {
          propertiesData = propertiesRes.results;
        }
      }

      let unitsData = [];
      if (unitsRes) {
        if (Array.isArray(unitsRes)) {
          unitsData = unitsRes;
        } else if (Array.isArray(unitsRes.data)) {
          unitsData = unitsRes.data;
        } else if (Array.isArray(unitsRes.results)) {
          unitsData = unitsRes.results;
        }
      }
  
      console.log('Processed properties data:', propertiesData);
      console.log('Processed units data:', unitsData);
  
      const unitsMap = {};
      for (const unit of unitsData) {
        const propId = unit.property || unit.property_id || unit.propertyId;
        if (propId) {
          if (!unitsMap[propId]) unitsMap[propId] = [];
          unitsMap[propId].push(unit);
        }
      }
  
      console.log('Units mapped by property:', unitsMap);
  
      const enriched = propertiesData.map((p) => {
        const property_id = p.property_id || p.id;
        const units = unitsMap[property_id] || [];
        
        console.log(`Property ${property_id} (${p.property_name}) has ${units.length} units`);
        
        return {
          ...p,
          property_id,
          units: units
        };
      });
  
      console.log('Final enriched properties:', enriched);
      setPropertiesList(enriched);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(`Failed to fetch properties: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeases = async () => {
    try {
      const token = localStorage.getItem("access");
  
      const response = await fetch("https://hemanth525.pythonanywhere.com/properties/lease/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (Array.isArray(data?.data)) {
        setLeaseList(data.data);
      } else if (Array.isArray(data)) {
        setLeaseList(data);
      } else {
        throw new Error("Unexpected lease response format");
      }
  
      console.log("Fetched leases:", data);
    } catch (err) {
      console.error("Lease fetch error:", err);
      setLeaseError("Failed to fetch leases: " + err.message);
    }
  };
  

  useEffect(() => {
    fetchPropertiesWithUnits();
    fetchAndSetBankAccountMap();
  }, []);

  // Fetch and map all bank accounts by user_id and property_id
  const fetchAndSetBankAccountMap = async () => {
    setBankAccountMapLoading(true);
    setBankAccountMapError(null);
    try {
      const access = localStorage.getItem('access');
      if (!access) throw new Error('User not authenticated');
      const map = await fetchBankAccountMap(access);
      setBankAccountMap(map);
    } catch (err) {
      setBankAccountMapError(err.message || 'Failed to fetch bank accounts');
      setBankAccountMap({});
    } finally {
      setBankAccountMapLoading(false);
    }
  };

  // Helper to get account for a given user and property
  const getBankAccountForUserProperty = (userId, propertyId) => {
    if (!userId || !propertyId) return null;
    return bankAccountMap[`${userId}_${propertyId}`] || null;
  };


  const togglePropertyExpansion = (propertyId) => {
    setExpandedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };



  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (propertyId) => {
    const property = propertiesList.find(p => p.id === propertyId || p.property_id === propertyId);
    if (!property) {
      setDeleteError('Property not found');
      return;
    }

    if (!window.confirm(`Are you sure you want to deactivate "${property.property_name}"? This will make the property inactive.`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    
    try {
      // Update the property to set active = 0
      const response = await axiosInstance.patch(`/properties/property/${propertyId}/`, { active: 0 });
      
      // Handle different successful response formats
      if (response?.data?.status === 1 || response?.status === 200) {
        // Update the property in the list to reflect the change
        setPropertiesList(prev => prev.map(p => 
          (p.id === propertyId || p.property_id === propertyId) 
            ? { ...p, active: 0 } 
            : p
        ));
        
        // Show success message
        const successMessage = response?.data?.message || 'Property has been deactivated successfully';
        alert(successMessage);
        
        // Close any related forms
        setShowPropertyForm(false);
        setEditingProperty(null);
      } else {
        throw new Error(response?.data?.message || 'Failed to deactivate property. Please try again.');
      }
    } catch (err) {
      console.error('Delete property error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         err.message || 
                         'Failed to deactivate property';
      setDeleteError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddUnit = (property) => {
    console.log('Add unit for property:', property);
    setSelectedProperty(property);
    setShowUnitForm(true);
  };

  const handleAddLease = (property, unit) => {
    console.log('Add lease for property:', property, 'unit:', unit);
    setSelectedProperty(property);
    setSelectedUnit(unit);
    setShowLeaseForm(true);
  };

  const handleAddInvoice = (property) => {
    console.log('Add invoice for property:', property);
    setSelectedProperty(property);
    setShowInvoiceForm(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handlePropertyAdded = (newProperty) => {
    console.log('New property added:', newProperty);
    fetchPropertiesWithUnits();
  };

  const handleUnitAdded = (newUnit) => {
    console.log('New unit added:', newUnit);
    
    setPropertiesList(prev => 
      prev.map(property => {
        const propertyId = property.property_id || property.id;
        const unitPropertyId = newUnit.property || newUnit.property_id;
        
        if (propertyId === unitPropertyId) {
          console.log(`Adding unit to property ${propertyId}`);
          return {
            ...property,
            units: [...(property.units || []), newUnit]
          };
        }
        return property;
      })
    );
    
    setShowUnitForm(false);
    setSelectedUnit(null);
    
    // Optionally refresh the data to ensure consistency
    // fetchPropertiesWithUnits();
  };

  const handleLeaseAdded = (newLease) => {
    console.log('New lease added:', newLease);
    setShowLeaseForm(false);
    setSelectedProperty(null);
    setSelectedUnit(null);
    fetchPropertiesWithUnits(); // Refresh to reflect lease changes
  };

  const handleInvoiceAdded = (newInvoice) => {
    console.log('New invoice added:', newInvoice);
    setShowInvoiceForm(false);
    setSelectedProperty(null);
    handleRefresh();
  };

  const handleImageUpload = (e, property) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name, file.type, file.size);
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    try {
      // Create a URL for the image file
      const imageUrl = URL.createObjectURL(file);
      console.log('Created image URL:', imageUrl);
      
      // Store the image in localStorage (as base64)
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Image = event.target.result;
        const propertyId = property.property_id || property.id;
        
        // Save to localStorage
        const propertyImages = JSON.parse(localStorage.getItem('propertyImages') || '{}');
        propertyImages[propertyId] = base64Image;
        localStorage.setItem('propertyImages', JSON.stringify(propertyImages));
        
        // Update UI
        setPropertiesList(prev => prev.map(p => {
          if ((p.property_id || p.id) === propertyId) {
            return { ...p, image_url: imageUrl };
          }
          return p;
        }));
        
        toast.success('Property image saved successfully');
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error handling image:', error);
      toast.error('Failed to process image. Please try again.');
    }
  };
  
  // Load saved images from localStorage when component mounts
  useEffect(() => {
    const loadSavedImages = () => {
      try {
        const propertyImages = JSON.parse(localStorage.getItem('propertyImages') || '{}');
        
        if (Object.keys(propertyImages).length > 0 && propertiesList.length > 0) {
          const updatedProperties = propertiesList.map(property => {
            const propertyId = property.property_id || property.id;
            if (propertyImages[propertyId]) {
              return { ...property, image_url: propertyImages[propertyId] };
            }
            return property;
          });
          
          setPropertiesList(updatedProperties);
        }
      } catch (error) {
        console.error('Error loading saved images:', error);
      }
    };
    
    loadSavedImages();
  }, [propertiesList.length]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const handleUpdateProperty = async (propertyData) => {
    const propertyId = editingProperty?.id || editingProperty?.property_id;
    if (!propertyId) {
      setUpdateError('Invalid property ID');
      return;
    }
  
    setIsUpdating(true);
    setUpdateError('');
    
    try {
      const response = await axiosInstance.patch(`/properties/property/${propertyId}/`, propertyData);
      
      // Handle different successful response formats
      if (response?.data?.status === 1 || response?.status === 200) {
        // Show success message
        const successMessage = response?.data?.message || 'Property updated successfully';
        alert(successMessage);
        
        // Close the form
        setShowPropertyForm(false);
        setEditingProperty(null);
        
        // Refresh the properties list to get the latest data
        await fetchPropertiesWithUnits();
        
        return true; // Indicate success
      } else {
        throw new Error(response?.data?.message || 'Update failed. No valid response from server.');
      }
    } catch (err) {
      console.error('Update property error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         err.message || 
                         'Failed to update property';
      setUpdateError(errorMessage);
      alert(`Update failed: ${errorMessage}`);
      return false; // Indicate failure
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingProperty) {
      const success = await handleUpdateProperty(formData);
      if (success) {
        // Optional: Any additional logic after successful update
        return true;
      }
      return false;
    } else {
      // Add property: send only form fields from the form
      const payload = { ...formData };
      try {
        console.log("Sending property payload:", payload);
        const response = await axiosInstance.post("properties/property_list/", payload);
        console.log("➡️ Property POST Response:", response.status, response.data);  // ✅ Add this line
        if ((response.status >= 200 && response.status < 300) && (response.data.status === 1 || response.data.id || response.data.property_id)) {
          fetchPropertiesWithUnits();
          return true;
        } else {
          alert(response.data.message || "❌ Failed to add property");
          return false;
        }
      } catch (err) {
        console.error("❌ Error adding property:", err);
        alert("❌ Error adding property: " + err.message);
        return false;
      }
      
    }
  };

  const handleRefresh = () => {
    fetchPropertiesWithUnits();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'bg-success bg-opacity-10 text-success fw-semibold',
      'Inactive': 'bg-danger bg-opacity-10 text-danger fw-semibold',
      'Occupied': 'bg-primary bg-opacity-10 text-primary fw-semibold',
      'Vacant': 'bg-warning bg-opacity-10 text-warning fw-semibold',
      'Maintenance': 'bg-warning bg-opacity-25 text-warning-dark fw-semibold'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-light text-secondary fw-semibold'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        <span className="ml-4 text-white">Loading properties and units...</span>
      </div>
    );
  }

  return (
    <div style={{marginLeft: '15px'}}>
      {/* MAIN HEADING AND ADD PROPERTY BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ paddingTop: '0.5rem' }}>
        <style>{`
  .add-property-btn {
    background-color: #30314f;
    color: #fff;
    border-color: #d1b480;
    transition: background 0.2s;
    padding-left: 1rem;
  }
  .add-property-btn:hover, .add-property-btn:focus {
    background-color: #30314f !important;
    color: #fff;
    border-color: #30314f !important;
  }
`}</style>
        <div className="d-flex align-items-center">
          <FiHome size={24} className="me-2" />
          <h2 className="h4 fw-bold mb-0">Properties</h2>
        </div>
        <button
          className="btn fw-bold add-property-btn ps-3"
          onClick={() => {
            setShowPropertyForm(true);
            setEditingProperty(null);
          }}
        >
          <FiPlus className="me-2" style={{verticalAlign:'middle'}} /> Add Property
        </button>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="d-flex align-items-center justify-content-between">
            <span>{error}</span>
            <button
              onClick={handleRefresh}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      ) : propertiesList.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {propertiesList.map((property, index) => {
            const propertyId = property.property_id || property.id;
            const isExpanded = expandedProperties.has(propertyId);

            // Robust userId extraction
            let userId = null;
            if (property.owner && typeof property.owner === 'object') {
              userId = property.owner.user_id || property.owner.id || null;
            } else if (typeof property.owner === 'number') {
              userId = property.owner;
            }
            if (!userId) {
              try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                userId = userObj?.user_id || userObj?.id || null;
              } catch {
                userId = null;
              }
            }
            const account = (userId && propertyId) ? getBankAccountForUserProperty(userId, propertyId) : null;

            return (
              <div className="col" key={`property-${propertyId || index}`}>
                <div className="card h-100 rounded shadow-sm overflow-hidden">
                  {/* Property Image */}
                  <div className="property-image-container position-relative" style={{height: '180px', overflow: 'hidden'}}>
                    {/* Status badge positioned at top right */}
                    <div className="position-absolute top-0 end-0 p-2 z-1">
                      {getStatusBadge(property.status || 'Active')}
                    </div>
                    
                    {property.image_url ? (
                      <img 
                        src={property.image_url} 
                        alt={property.property_name} 
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <div className="text-center">
                          <FiHome className="text-secondary mb-2" style={{fontSize: '2rem'}} />
                          <div>
                            <label htmlFor={`property-image-upload-${propertyId}`} className="btn btn-sm btn-outline-primary">
                              <FiUpload className="me-1" /> Upload Image
                            </label>
                            <input 
                              id={`property-image-upload-${propertyId}`} 
                              type="file" 
                              accept="image/*" 
                              className="d-none" 
                              onChange={(e) => handleImageUpload(e, property)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {property.image_url && (
                      <div className="position-absolute bottom-0 end-0 p-2">
                        <label htmlFor={`property-image-upload-${propertyId}`} className="btn btn-sm btn-light opacity-75 hover-opacity-100">
                          <FiEdit2 size={14} className="me-1" /> Change
                        </label>
                        <input 
                          id={`property-image-upload-${propertyId}`} 
                          type="file" 
                          accept="image/*" 
                          className="d-none" 
                          onChange={(e) => handleImageUpload(e, property)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body p-3 d-flex flex-column">
                    <div>
                      <h3 className="fw-bold fs-6 mb-2">{property.property_name}</h3>
                      <div className="d-flex align-items-center mb-2">
                        <FiMapPin style={{fontSize:'0.875rem',marginRight:'0.25rem'}} className="text-secondary" />
                        <span className="small text-secondary">{property.property_address}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-end align-items-center mb-2">
                        <button 
                          className="btn btn-sm d-flex align-items-center gap-1" 
                          onClick={() => {
                            setSelectedUnitsProperty(property);
                            setShowUnitsModal(true);
                          }}
                          style={{ backgroundColor: '#30314f', color: '#fff', borderColor: '#30314f' }}
                        >
                          <span>{property.units?.length || 0} Units</span>
                          <Icon 
                            icon="mdi:chevron-right" 
                            width={16} 
                            height={16} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Units are now shown in the modal popup */}
                  
                  {/* Action buttons */}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm d-flex align-items-center"
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowBankAccountForm(true);
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'white',
                          color: getBankAccountForUserProperty(JSON.parse(localStorage.getItem('user'))?.user_id || JSON.parse(localStorage.getItem('user'))?.id, property.property_id) ? '#30314f' : '#6c757d',
                          borderColor: getBankAccountForUserProperty(JSON.parse(localStorage.getItem('user'))?.user_id || JSON.parse(localStorage.getItem('user'))?.id, property.property_id) ? '#30314f' : '#6c757d',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#d1b480';
                          e.currentTarget.style.borderColor = '#d1b480';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = getBankAccountForUserProperty(JSON.parse(localStorage.getItem('user'))?.user_id || JSON.parse(localStorage.getItem('user'))?.id, property.property_id) ? '#30314f' : '#6c757d';
                          e.currentTarget.style.borderColor = getBankAccountForUserProperty(JSON.parse(localStorage.getItem('user'))?.user_id || JSON.parse(localStorage.getItem('user'))?.id, property.property_id) ? '#30314f' : '#6c757d';
                        }}
                      >
                        <Icon icon="mdi:bank-outline" className="me-1" size={14} />
                        {(() => {
                          const bankAccount = getBankAccountForUserProperty(
                            JSON.parse(localStorage.getItem('user'))?.user_id || JSON.parse(localStorage.getItem('user'))?.id,
                            property.property_id
                          );
                          return bankAccount ? bankAccount.payment_type : 'Account';
                        })()}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        onClick={() => handleAddUnit(property)}
                        style={{padding: '0.25rem 0.5rem'}}
                      >
                        <FiPlus className="me-1" size={14} /> Unit
                      </button>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center p-1"
                        onClick={() => handleEdit(property)}
                        title="Edit Property"
                        style={{width: '28px', height: '28px'}}
                      >
                        <Icon icon="lucide:edit" width={16} height={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-1"
                        onClick={() => handleDelete(propertyId)}
                        title="Delete Property"
                        style={{width: '28px', height: '28px'}}
                      >
                        <Icon icon="mdi:delete-outline" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
        </div>
      ) : (
        <div className="bg-white rounded shadow p-5 text-center">
          <FiHome className="d-block mx-auto text-secondary mb-3" style={{fontSize:'3rem'}} />
          <h3 className="h5 fw-bold text-dark mb-2">No properties found</h3>
          <p className="text-secondary mb-4">Get started by adding a new property.</p>
          <button
            className="btn fw-bold"
            style={{ backgroundColor: '#30314f', color: '#fff', borderColor: '#30314f' }}
            onClick={() => {
              setShowPropertyForm(true);
              setEditingProperty(null);
            }}
          >
            <FiPlus className="me-2" style={{verticalAlign:'middle'}} /> Add Property
          </button>
        </div>
      )}

      {/* Modal Component for Popup */}
      {showPropertyForm && (
        <Modal onClose={() => {
          setShowPropertyForm(false);
          setEditingProperty(null);
        }}>
          <PropertyForm
            onClose={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
            }}
            onPropertyAdded={handlePropertyAdded}
            onSubmit={handleFormSubmit}
            property={editingProperty}
          />
        </Modal>
      )}



      {showUnitForm && (
        <Modal onClose={() => {
          setShowUnitForm(false);
          setSelectedProperty(null);
        }}>
          <UnitAdd
            property={selectedProperty}
            onClose={() => {
              setShowUnitForm(false);
              setSelectedProperty(null);
            }}
            onUnitAdded={handleUnitAdded}
          />
        </Modal>
      )}

      {showBankAccountForm && (
        <Modal onClose={() => setShowBankAccountForm(false)}>
          <style jsx>{`
            .add-account-btn {
              background-color: #30314f;
              border-color: #30314f;
              color: #fff;
              transition: all 0.3s ease;
            }
            .add-account-btn:hover:not(:disabled) {
              background-color: #d1b480 !important;
              border-color: #d1b480 !important;
              color: #fff !important;
            }
            .account-btn:hover {
              background-color: #d1b480 !important;
              border-color: #d1b480 !important;
              color: #fff !important;
              transition: all 0.3s ease;
            }
          `}</style>
          <form onSubmit={handleBankAccountSubmit}>
            <h5 className="fw-bold mb-3">Add Bank Account</h5>
            {(() => {
              let modalUserId = null;
              try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                modalUserId = userObj?.user_id || userObj?.id || null;
              } catch {
                modalUserId = null;
              }
              return (
                <div className="mb-3">
                  <b>User ID:</b> {modalUserId ? modalUserId : <span style={{ color: 'red' }}>Not logged in</span>}
                </div>
              );
            })()}
            <div className="mb-2">
              <strong>Property:</strong> {selectedProperty?.property_name || selectedProperty?.id || "Not selected"}<br/>
              <strong>Unit:</strong> {selectedUnit?.unit_name || selectedUnit?.id || "None"}
            </div>
            <div className="mb-2">
              <label className="form-label">Payment Type</label>
              <select
                name="payment_type"
                value={bankAccountForm.payment_type}
                onChange={handleBankAccountChange}
                className="form-select"
                required
              >
                <option value="Stripe">Stripe</option>
                <option value="Paypal">Paypal</option>
              </select>
            </div>
            {bankAccountForm.payment_type === 'Stripe' && (
              <>
                <div className="mb-2">
                  <label className="form-label">Stripe Secret Key</label>
                  <input
                    type="text"
                    name="stripe_secret_key"
                    value={bankAccountForm.stripe_secret_key}
                    onChange={handleBankAccountChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Stripe Publishable Key</label>
                  <input
                    type="text"
                    name="stripe_publishable_key"
                    value={bankAccountForm.stripe_publishable_key}
                    onChange={handleBankAccountChange}
                    className="form-control"
                    required
                  />
                </div>
              </>
            )}
            {bankAccountForm.payment_type === 'Paypal' && (
              <>
                <div className="mb-2">
                  <label className="form-label">Paypal Client ID</label>
                  <input
                    type="text"
                    name="paypal_client_id"
                    value={bankAccountForm.paypal_client_id}
                    onChange={handleBankAccountChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Paypal Secret Key</label>
                  <input
                    type="text"
                    name="paypal_secret_key"
                    value={bankAccountForm.paypal_secret_key}
                    onChange={handleBankAccountChange}
                    className="form-control"
                    required
                  />
                </div>
              </>
            )}
            {bankAccountError && <div className="alert alert-danger">{bankAccountError}</div>}
            {bankAccountSuccess && <div className="alert alert-success">{bankAccountSuccess}</div>}
            <div className="d-flex gap-2 mt-3">
              {(() => {
                let modalUserId = null;
                try {
                  const userObj = JSON.parse(localStorage.getItem('user'));
                  modalUserId = userObj?.user_id || userObj?.id || null;
                } catch {
                  modalUserId = null;
                }
                return (
                  <button
                    type="submit"
                    className={`btn me-2 ${!modalUserId ? '' : 'add-account-btn'}`}
                    disabled={bankAccountLoading || !modalUserId}
                    style={{ 
                      backgroundColor: !modalUserId ? '#ccc' : undefined, 
                      borderColor: !modalUserId ? '#ccc' : undefined,
                      color: !modalUserId ? '#666' : undefined
                    }}
                  >
                    {bankAccountLoading ? 'Adding...' : 'Add Account'}
                  </button>
                );
              })()}
              <button type="button" className="btn btn-secondary" onClick={() => setShowBankAccountForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showLeaseForm && (
        <Modal onClose={() => {
          setShowLeaseForm(false);
          setSelectedProperty(null);
          setSelectedUnit(null);
        }}>
          <LeaseForm
            property={selectedProperty}
            unit={selectedUnit}
            onClose={() => {
              setShowLeaseForm(false);
              setSelectedProperty(null);
              setSelectedUnit(null);
            }}
            onLeaseAdded={handleLeaseAdded}
          />
        </Modal>
      )}

      {showInvoiceForm && (
        <Modal onClose={() => {
          setShowInvoiceForm(false);
          setSelectedProperty(null);
        }}>
          <InvoiceForm
            property={selectedProperty}
            onClose={() => {
              setShowInvoiceForm(false);
              setSelectedProperty(null);
            }}
            onInvoiceAdded={handleInvoiceAdded}
          />
        </Modal>
      )}

      {/* Units Modal */}
      {showUnitsModal && selectedUnitsProperty && (
        <Modal onClose={() => {
          setShowUnitsModal(false);
          setSelectedUnitsProperty(null);
        }}>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <Icon icon="mdi:arrow-right" className="me-2" width={20} height={20} style={{ color: '#30314f' }} />
                <h5 className="fw-bold mb-0">{selectedUnitsProperty.property_name} - Units</h5>
              </div>
              <button 
                className="btn-close" 
                onClick={() => {
                  setShowUnitsModal(false);
                  setSelectedUnitsProperty(null);
                }}
              ></button>
            </div>
            
            {selectedUnitsProperty.units?.length > 0 ? (
              <div className="row row-cols-1 g-3">
                {selectedUnitsProperty.units.map((unit, idx) => (
                  <div key={`modal-unit-${unit.id || idx}`} className="col">
                    <div className="bg-white rounded p-3 border shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FiUser className="text-secondary me-2" />
                          <h6 className="fw-bold mb-0">
                            {unit.unit_name || `Unit ${unit.unit_number || idx + 1}`}
                          </h6>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-success d-flex align-items-center"
                            onClick={() => {
                              setShowUnitsModal(false);
                              setSelectedUnitsProperty(null);
                              handleAddLease(selectedUnitsProperty, unit);
                            }}
                          >
                            <FiFileText className="me-1" /> Lease
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            onClick={() => {
                              setShowUnitsModal(false);
                              setSelectedUnitsProperty(null);
                              handleAddInvoice(selectedUnitsProperty);
                            }}
                          >
                            <FiDollarSign className="me-1" /> Invoice
                          </button>
                        </div>
                      </div>
                      
                      {unit.unit_address && (
                        <div className="d-flex align-items-center text-secondary mb-2">
                          <FiMapPin className="me-1" />
                          <small>{unit.unit_address}</small>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        {unit.unit_rent && (
                          <div><small>Rent: <span className="text-success fw-medium">${unit.unit_rent}</span></small></div>
                        )}
                        {unit.tenant_name && (
                          <div><small>Tenant: <span className="text-dark">{unit.tenant_name}</span></small></div>
                        )}
                        {unit.lease_start && (
                          <div><small>Lease Start: <span className="text-dark">{new Date(unit.lease_start).toLocaleDateString()}</span></small></div>
                        )}
                        {unit.lease_end && (
                          <div><small>Lease End: <span className="text-dark">{new Date(unit.lease_end).toLocaleDateString()}</span></small></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FiHome className="d-block mx-auto text-secondary mb-3" style={{fontSize:'2rem'}} />
                <h6 className="fw-bold text-dark">No units available</h6>
                <p className="small text-secondary mb-3">Add your first unit to get started.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowUnitsModal(false);
                    setSelectedUnitsProperty(null);
                    handleAddUnit(selectedUnitsProperty);
                  }}
                >
                  <FiPlus className="me-1" /> Add Unit
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}