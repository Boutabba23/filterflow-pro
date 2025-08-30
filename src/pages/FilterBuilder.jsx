import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFilter } from '../contexts/FilterContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import './FilterBuilder.css';

const FilterBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addFilter, updateFilter, getFilterById, loading } = useFilter();

  const [filterName, setFilterName] = useState('');
  const [filterDescription, setFilterDescription] = useState('');
  const [filterRules, setFilterRules] = useState([{ id: 1, field: '', operator: '', value: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const filter = getFilterById(id);
      if (filter) {
        setFilterName(filter.name);
        setFilterDescription(filter.description || '');
        setFilterRules(filter.rules || [{ id: 1, field: '', operator: '', value: '' }]);
      } else {
        setError('Filter not found');
      }
    }
  }, [id, getFilterById]);

  const addRule = () => {
    setFilterRules([...filterRules, { id: Date.now(), field: '', operator: '', value: '' }]);
  };

  const removeRule = (id) => {
    if (filterRules.length > 1) {
      setFilterRules(filterRules.filter(rule => rule.id !== id));
    }
  };

  const updateRule = (id, field, value) => {
    setFilterRules(filterRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filterName.trim()) {
      return setError('Filter name is required');
    }

    // Validate that at least one rule has all fields filled
    const validRules = filterRules.filter(rule => 
      rule.field && rule.operator && rule.value !== ''
    );

    if (validRules.length === 0) {
      return setError('At least one complete filter rule is required');
    }

    try {
      setError('');
      setSaving(true);

      const filterData = {
        name: filterName,
        description: filterDescription,
        rules: validRules,
        status: 'active',
        lastUsed: new Date().toISOString()
      };

      if (isEditing) {
        await updateFilter(id, filterData);
        setSuccess('Filter updated successfully');
      } else {
        await addFilter(filterData);
        setSuccess('Filter created successfully');
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/my-filters');
      }, 1500);

    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} filter. ${err.message}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const fieldOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'date', label: 'Date' },
    { value: 'status', label: 'Status' },
    { value: 'category', label: 'Category' },
    { value: 'amount', label: 'Amount' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Not Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="filter-builder">
      <div className="container">
        <div className="filter-builder-header">
          <h1>{isEditing ? 'Edit Filter' : 'Create New Filter'}</h1>
          <p>Build powerful filters to process your data</p>
        </div>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="filter-builder-content">
          <div className="filter-form-container">
            <form onSubmit={handleSubmit} className="filter-form">
              <div className="form-group">
                <label htmlFor="filterName">Filter Name</label>
                <input
                  type="text"
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="form-control"
                  placeholder="Enter filter name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="filterDescription">Description (Optional)</label>
                <textarea
                  id="filterDescription"
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  className="form-control"
                  placeholder="Describe what this filter does"
                  rows="3"
                />
              </div>

              <div className="filter-rules">
                <div className="rules-header">
                  <h3>Filter Rules</h3>
                  <button type="button" onClick={addRule} className="btn btn-sm btn-outline">
                    + Add Rule
                  </button>
                </div>

                {filterRules.map((rule, index) => (
                  <div key={rule.id} className="rule-row">
                    <div className="rule-number">{index + 1}</div>
                    <div className="rule-fields">
                      <div className="form-group">
                        <select
                          value={rule.field}
                          onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Field</option>
                          {fieldOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                          className="form-control"
                          disabled={!rule.field}
                        >
                          <option value="">Select Operator</option>
                          {operatorOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className="form-control"
                          placeholder="Value"
                          disabled={!rule.operator}
                        />
                      </div>
                    </div>

                    {filterRules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        className="btn btn-sm btn-danger"
                        aria-label="Remove rule"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Filter' : 'Create Filter')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/my-filters')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="filter-preview-container">
            <div className="filter-preview">
              <h3>Filter Preview</h3>
              <div className="preview-content">
                {filterName ? (
                  <>
                    <div className="preview-name">
                      <strong>Name:</strong> {filterName}
                    </div>
                    {filterDescription && (
                      <div className="preview-description">
                        <strong>Description:</strong> {filterDescription}
                      </div>
                    )}
                    <div className="preview-rules">
                      <strong>Rules:</strong>
                      <ul>
                        {filterRules
                          .filter(rule => rule.field && rule.operator && rule.value !== '')
                          .map((rule, index) => {
                            const fieldLabel = fieldOptions.find(f => f.value === rule.field)?.label || rule.field;
                            const operatorLabel = operatorOptions.find(o => o.value === rule.operator)?.label || rule.operator;
                            return (
                              <li key={rule.id}>
                                {fieldLabel} {operatorLabel} "{rule.value}"
                              </li>
                            );
                          })}
                      </ul>
                      {filterRules.filter(rule => rule.field && rule.operator && rule.value !== '').length === 0 && (
                        <p className="no-rules">No complete rules yet</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="empty-preview">Enter filter details to see preview</p>
                )}
              </div>
            </div>

            <div className="filter-tips">
              <h3>Tips</h3>
              <ul>
                <li>Use specific field names for better filtering results</li>
                <li>Combine multiple rules to create complex filters</li>
                <li>Save your filters for future use</li>
                <li>Test your filters before applying to large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBuilder;
