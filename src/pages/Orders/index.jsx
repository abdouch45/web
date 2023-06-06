import React, { useState, useEffect } from 'react';
import { calculateRange, sliceData } from '../../utils/table-pagination';
import axios from 'axios';
import '../styles.css';

function Demandes() {
  const [search, setSearch] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setFilteredDemandes(demandes); 
  }, [demandes]);

  useEffect(() => {
    setPagination(calculateRange(filteredDemandes, 10));
    setPage(1);
  }, [filteredDemandes]);

  // Search
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    if (searchValue !== '') {
      const searchResults = demandes.filter(
        (item) =>
          item.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.prenom.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredDemandes(searchResults);
    } else {
      setFilteredDemandes(demandes);
    }
  };
  const token = localStorage.getItem('token');

  const getData = () => {
    axios
      .get('http://localhost:80/api/comptenonvalid', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDemandes(response.data); 
        setLoading(false); 
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        setLoading(false); // Set loading to false even in case of error
      });
  };
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    getData();
  }, []);

 
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };


  const slicedDemandes = sliceData(filteredDemandes, page, 10);

  return (
    <div className='dashboard-content'>
      <div></div>
      <div className='dashboard-content-container'>
        <div className='dashboard-content-header'>
          <h2>List des Demandes</h2>
          <div className='dashboard-content-search'>
            <input
              type='text'
              value={search}
              placeholder='rechercher..'
              className='dashboard-content-input'
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className='loading-animation'>Loading...</div> // Render loading animation while data is being fetched
        ) : (
          <table>
            <thead>
              <tr>
                <th>CERTIFICAT</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>COMPTE</th>
                <th>TYPE</th>
              </tr>
            </thead>

            {slicedDemandes.length !== 0 ? (
              <tbody>
                {slicedDemandes.map((demande, index) => (
                  <tr key={index}>
                    <td>
                      <a href={demande.certificat} target='_blank' rel='noopener noreferrer'>
                        click ici
                      </a>
                    </td>
                    <td>
                      <span>{dateFormat(demande.created_at)}</span>
                    </td>
                    <td>
                      <div>
                        {demande.valid === 0 ? (
                          <span>en traitement</span>
                        ) : (
                          <span>erreur</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span>
                          {demande.nom} {demande.prenom}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span>{demande.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan='5' className='empty-table'>
                    No data
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}

        {filteredDemandes.length !== 0 ? (
          <div className='dashboard-content-footer'>
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? 'active-pagination' : 'pagination'}
                onClick={() => handleChangePage(item)}
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Demandes;
