import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '../features/patients/patientSlice';
import PatientModal from '../components/modal/PatientModal';
import PatientCard from '../components/PatientCard';
import PatientRow from '../components/PatientRow';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import "../styles/patients.css";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

interface FilterState {
  city: string;
  gender: string;
  status: string;
}

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((s) => s.patients);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({ 
    city: '', 
    gender: '', 
    status: '' 
  });
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const dataInitializedRef = useRef(false); 
  const filterOptions = useMemo(() => {
    if (!list.length) return { cities: [], genders: [], statuses: [] };
    
    const cities = Array.from(new Set(list.map(p => p.city))).sort();
    const genders = Array.from(new Set(list.map(p => p.gender))) as ('Male' | 'Female' | 'Other')[];
    const statuses = Array.from(new Set(list.map(p => p.status))) as ('active' | 'discharged' | 'archived' | 'critical' | 'recover' | 'emergency' | 'admitted')[];

    return { cities, genders, statuses };
  }, [list]);

  // LOAD PATIENTS - ONLY ONCE
  useEffect(() => {
    //  Redux handles caching - only fetch if empty
    if (list.length === 0 && !loading && !dataInitializedRef.current) {
      dispatch(fetchPatients());
      dataInitializedRef.current = true; //  Prevent future fetches
    }
  }, [dispatch, list.length, loading]);

  // Filtered patients - optimized
  const filteredPatients = useMemo(() => 
    list.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filters.city || patient.city.toLowerCase() === filters.city.toLowerCase()) &&
      (!filters.gender || patient.gender.toLowerCase() === filters.gender.toLowerCase()) &&
      (!filters.status || patient.status === filters.status)
    ),
    [list, searchTerm, filters]
  );

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ city: '', gender: '', status: '' });
  }, []);

  const setGridView = useCallback(() => setCurrentView('grid'), []);
  const setListView = useCallback(() => setCurrentView('list'), []);
  const goToDashboard = useCallback(() => navigate('/dashboard'), [navigate]);
  const isContentLoading = loading && list.length === 0;

  const handleRefresh = useCallback(() => {
    dataInitializedRef.current = false;
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <div className="patients-page">
      <PageHeader
        title="Patients"
        subtitle={`${filteredPatients.length} of ${list.length} patients`}
        buttons={[
          {
            label: "Dashboard",
            variant: "success",
            size: "md",
            onClick: goToDashboard
          },
          {
            label: "Add Patient",
            variant: "primary",
            size: "md",
            onClick: () => setShowAddModal(true)
          },
          
        ]}
      />
      <div className="controls-row">
        <div className="filters-section">
          <div className="filter-row">
            <input 
              type="text"
              placeholder="🔍 Search name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-inline"
            />
            
            <select 
              value={filters.city} 
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="filter-select"
              disabled={isContentLoading}
            >
              <option value="">All Cities ({filterOptions.cities.length})</option>
              {filterOptions.cities.slice(0, 8).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select 
              value={filters.gender} 
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="filter-select"
              disabled={isContentLoading}
            >
              <option value="">All Genders ({filterOptions.genders.length})</option>
              {filterOptions.genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
              disabled={isContentLoading}
            >
              <option value="">All Status ({filterOptions.statuses.length})</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              disabled={isContentLoading}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="view-toggle-section">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${currentView === 'grid' ? 'active' : ''}`} 
              onClick={setGridView}
              title="Grid View"
              disabled={isContentLoading}
            >
              🟰
            </button>
            <button 
              className={`toggle-btn ${currentView === 'list' ? 'active' : ''}`} 
              onClick={setListView}
              title="List View"
              disabled={isContentLoading}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Content - Only this loads */}
      <div className="patients-display">
        {isContentLoading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No patients found</h3>
            <p>No patients match your current search or filter criteria.</p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : currentView === 'grid' ? (
          <div className="patient-grid">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>City</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <PatientRow key={patient.id} patient={patient} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <PatientModal
        isOpen={showAddModal}
        patient={undefined}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          dataInitializedRef.current = false;
          dispatch(fetchPatients());
        }}
      />
    </div>
  );
}
