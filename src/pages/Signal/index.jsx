import React, {useState, useEffect} from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import axios from 'axios';
import all_orders from '../../constants/orders';
import {calculateRange, sliceData} from '../../utils/table-pagination';

import '../styles.css';
import DoneIcon from '../../assets/icons/done.svg';
import CancelIcon from '../../assets/icons/cancel.svg';
import RefundedIcon from '../../assets/icons/refunded.svg';

function Signals () {
    const [search, setSearch] = useState('');
    const [demandes, setOrders] = useState(all_orders);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);

    useEffect(() => {
        setPagination(calculateRange(all_orders, 10));
        setOrders(sliceData(all_orders, page, 10));
    }, []);

    // Search
    const __handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = demandes.filter((item) =>
                item.first_name.toLowerCase().includes(search.toLowerCase()) ||
                item.last_name.toLowerCase().includes(search.toLowerCase()) 
            );
            setOrders(search_results);
        }
        else {
            __handleChangePage(1);
        }
    };
    const token = localStorage.getItem('token');

  const getData= ()=>{
    axios
      .get('http://localhost:80/api/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); 
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setOrders(sliceData(all_orders, new_page, 5));
    }

    return(
        <div className='dashboard-content'>
           <div ></div>
            <div className='dashboard-content-container'>
                <div className='dashboard-content-header'>
                    <h2>List des Signals</h2>
                    <div className='dashboard-content-search'>
                        <input
                            type='text'
                            value={search}
                            placeholder='rechercher..'
                            className='dashboard-content-input'
                            onChange={e => __handleSearch(e)} />
                    </div>
                </div>

                <table>
                    <thead>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>COMPTE</th>
                        <th>CAUSE</th>
                    </thead>

                    {demandes.length !== 0 ?
                        <tbody>
                            {demandes.map((demande, index) => (
                                <tr key={index}>
                                    <td><span>{demande.id}</span></td>
                                    <td><span>{demande.date}</span></td>
                                    <td>
                                        <div>
                                            {demande.status === 'Paid' ?
                                                <img
                                                    src={DoneIcon}
                                                    alt='paid-icon'
                                                    className='dashboard-content-icon' />
                                            : demande.status === 'Canceled' ?
                                                <img
                                                    src={CancelIcon}
                                                    alt='canceled-icon'
                                                    className='dashboard-content-icon' />
                                            : demande.status === 'Refunded' ?
                                                <img
                                                    src={RefundedIcon}
                                                    alt='refunded-icon'
                                                    className='dashboard-content-icon' />
                                            : null}
                                            <span>{demande.status}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            
                                            <span>{demande.first_name} {demande.last_name}</span>
                                        </div>
                                    </td>
                                    <td><span>{demande.product}</span></td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    : null}
                </table>

                {demandes.length !== 0 ?
                    <div className='dashboard-content-footer'>
                        {pagination.map((item, index) => (
                            <span 
                                key={index} 
                                className={item === page ? 'active-pagination' : 'pagination'}
                                onClick={() => __handleChangePage(item)}>
                                    {item}
                            </span>
                        ))}
                    </div>
                : 
                    <div className='dashboard-content-footer'>
                        <span className='empty-table'>No data</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default Signals;