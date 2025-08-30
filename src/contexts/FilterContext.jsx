import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FilterContext = createContext();

export function useFilter() {
  return useContext(FilterContext);
}

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user's filters from Firestore
  async function fetchFilters() {
    if (!currentUser) {
      setFilters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, 'filters'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const filtersData = [];

      querySnapshot.forEach((doc) => {
        filtersData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setFilters(filtersData);
    } catch (error) {
      console.error('Error fetching filters:', error);
    } finally {
      setLoading(false);
    }
  }

  // Add a new filter
  async function addFilter(filterData) {
    if (!currentUser) {
      throw new Error('You must be logged in to create a filter');
    }

    try {
      const newFilter = {
        ...filterData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'filters'), newFilter);

      // Update local state
      setFilters(prev => [
        { id: docRef.id, ...newFilter },
        ...prev
      ]);

      return docRef.id;
    } catch (error) {
      console.error('Error adding filter:', error);
      throw error;
    }
  }

  // Update an existing filter
  async function updateFilter(id, filterData) {
    try {
      const updatedFilter = {
        ...filterData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'filters', id), updatedFilter);

      // Update local state
      setFilters(prev => 
        prev.map(filter => 
          filter.id === id 
            ? { ...filter, ...updatedFilter } 
            : filter
        )
      );
    } catch (error) {
      console.error('Error updating filter:', error);
      throw error;
    }
  }

  // Delete a filter
  async function deleteFilter(id) {
    try {
      await deleteDoc(doc(db, 'filters', id));

      // Update local state
      setFilters(prev => prev.filter(filter => filter.id !== id));
    } catch (error) {
      console.error('Error deleting filter:', error);
      throw error;
    }
  }

  // Get a filter by ID
  function getFilterById(id) {
    return filters.find(filter => filter.id === id);
  }

  // Fetch filters when user changes
  useEffect(() => {
    fetchFilters();
  }, [currentUser]);

  const value = {
    filters,
    loading,
    addFilter,
    updateFilter,
    deleteFilter,
    getFilterById,
    fetchFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}
