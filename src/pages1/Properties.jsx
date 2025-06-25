import { useState, useEffect } from 'react';
import { FiHome, FiPlus, FiMapPin, FiUser, FiRefreshCw, FiFileText, FiDollarSign } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import { properties } from '../services/api';
import PropertyForm from '../Forms/PropertyForm';
import UnitAdd from '../Forms/UnitAdd';
import LeaseForm from '../Forms/LeaseForm';
import InvoiceForm from '../Forms/InvoiceForm';

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

  const fetchPropertiesWithUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching properties and units...');
  
      const [propertiesRes, unitsRes] = await Promise.all([
        properties.getProperties(),
        properties.getUnits()
      ]);
  
      console.log('Properties response:', propertiesRes);
      console.log('Units response:', unitsRes);
  
      let propertiesData = [];
      if (propertiesRes.data) {
        if (Array.isArray(propertiesRes.data)) {
          propertiesData = propertiesRes.data;
        } else if (Array.isArray(propertiesRes.data.data)) {
          propertiesData = propertiesRes.data.data;
        } else if (Array.isArray(propertiesRes.data.results)) {
          propertiesData = propertiesRes.data.results;
        }
      }
  
      let unitsData = [];
      if (unitsRes.data) {
        if (Array.isArray(unitsRes.data)) {
          unitsData = unitsRes.data;
        } else if (Array.isArray(unitsRes.data.data)) {
          unitsData = unitsRes.data.data;
        } else if (Array.isArray(unitsRes.data.results)) {
          unitsData = unitsRes.data.results;
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

  useEffect(() => {
    fetchPropertiesWithUnits();
  }, []);

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
      const response = await properties.updateproperty(propertyId, { active: 0 });
      
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
    setSelectedUnit(null);
    // Optionally refresh data
    fetchPropertiesWithUnits();
  };

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
      const response = await properties.updateproperty(propertyId, propertyData);
      
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
      // PropertyForm will handle adding a new property via onPropertyAdded
      return true;
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
    <div>
      {/* MAIN HEADING AND ADD PROPERTY BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark m-0">Properties</h5>
        <button
          className="btn btn-primary fw-bold"
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
        <div className="d-flex flex-column gap-3">
          {propertiesList.map((property, index) => {
            const propertyId = property.property_id || property.id;
            const isExpanded = expandedProperties.has(propertyId);
            
            return (
              <div key={`property-${propertyId || index}`} className="card rounded shadow-sm overflow-auto position-relative">
                <div className="card-header bg-light border-bottom border-secondary px-4 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <FiHome className="text-primary w-6 h-6" />
                      <div>
                        <h3 className="fw-bold text-dark fs-6 mb-0">{property.property_name}</h3>
                        <div className="d-flex align-items-center text-secondary mt-1">
  <FiMapPin style={{fontSize:'1.1rem',marginRight:'0.25rem'}} />
  <span className="small">{property.property_address}</span>
</div>
<div className="d-flex align-items-center gap-2 mt-2">
  {getStatusBadge(property.status || 'Active')}
  <span className="badge bg-primary text-white rounded-pill px-3 py-1">
    {property.units?.length || 0} Units
  </span>
</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
  <div className="d-flex gap-2">
    <button
      onClick={() => handleAddUnit(property)}
      style={{ backgroundColor:'#E0AFFF', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}
      className="btn btn-sm d-flex align-items-center"
    >
      <FiPlus style={{ fontSize: '1.1rem', marginRight: '0.25rem' }} /> Add Unit
    </button>
    <button
      type="button"
      onClick={() => handleEdit(property)}
      className="w-32-px h-32-px me-2 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
      aria-label="Edit property"
    >
      <Icon icon="lucide:edit" style={{ fontSize: '1.2rem' }} />
    </button>
    <button
      type="button"
      onClick={() => handleDelete(propertyId)}
      className="w-32-px h-32-px me-2 bg-danger-100 text-danger-600 rounded-circle d-inline-flex align-items-center justify-content-center border-0"
      aria-label="Delete property"
      disabled={isDeleting}
      style={{ opacity: isDeleting ? 0.5 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
    >
      {isDeleting ? (
        <FiRefreshCw className="animate-spin w-4 h-4" />
      ) : (
        <Icon icon="mingcute:delete-2-line" style={{ fontSize: '1.2rem' }} />
      )}
    </button>
    <button
      onClick={() => togglePropertyExpansion(propertyId)}
      className="btn btn-link text-secondary fs-5 fw-bold p-0"
      style={{textDecoration: 'none'}}>
      {isExpanded ? '↑' : '↓'}
    </button>
  </div>
</div>
                  </div>
                </div>
              


                
                   
                   

                {isExpanded && (
                  <div className="px-6 py-4">
                    {property.units?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {property.units.map((unit, idx) => (
                          <div key={`unit-${unit.id || idx}`} className="bg-light rounded-lg p-4 border border-secondary">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <FiUser className="text-secondary w-4 h-4 mr-2" />
                                <h4 className="fw-bold text-dark fs-6">
                                  {unit.unit_name || `Unit ${unit.unit_number || idx + 1}`}
                                </h4>
                              </div>
                              
                            </div>
                            {unit.unit_address && (
                              <div className="flex items-center text-secondary mb-2">
                                <FiMapPin className="w-3 h-3 mr-1" />
                                <span className="text-sm">{unit.unit_address}</span>
                              </div>
                            )}
                            <div className="fw-normal text-dark">
                              {unit.unit_rent && (
                                <div>Rent: <span className="text-success fw-medium">${unit.unit_rent}</span></div>
                              )}
                              {unit.tenant_name && (
                                <div>Tenant: <span className="text-dark">{unit.tenant_name}</span></div>
                              )}
                              {unit.lease_start && (
                                <div>Lease Start: <span className="text-dark">{new Date(unit.lease_start).toLocaleDateString()}</span></div>
                              )}
                              {unit.lease_end && (
                                <div>Lease End: <span className="text-dark">{new Date(unit.lease_end).toLocaleDateString()}</span></div>
                              )}
                            </div>
                            <div className="d-flex gap-2 mt-3">
                              <button
                                onClick={() => handleAddLease(property, unit)}
                                className="btn btn-primary-600 d-flex align-items-center gap-1"
                              >
                                <FiFileText style={{fontSize:'1.1rem',marginRight:'0.25rem'}} /> Add Lease
                              </button>
                              <button
                                onClick={() => handleAddInvoice(property)}
                                className="btn btn-warning btn-sm d-flex align-items-center"
                              >
                                <FiDollarSign style={{fontSize:'1.1rem',marginRight:'0.25rem'}} /> Add Invoice
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FiHome className="d-block mx-auto text-secondary mb-3" style={{fontSize:'2.5rem'}} />
                        <h3 className="h5 fw-bold text-dark">No units available</h3>
                        <p className="text-secondary">Add your first unit to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded shadow p-4 text-center">
          <FiHome className="d-block mx-auto text-secondary" style={{fontSize:'2.5rem'}} />
          <h3 className="h6 fw-bold text-dark">No properties found</h3>
          <p className="small text-secondary">Get started by adding a new property.</p>
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
    </div>
  );
}