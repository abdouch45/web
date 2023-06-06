import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles.css';


function AjouterCompte () {
    return(
        <div className='dashboard-content'>
           <div >
            <form>
              <input type="email"  />
            <input type="password" />
            <button type='submit'></button>
            </form>
           </div>
            
        </div>
    )
   

   
    }

    


export default AjouterCompte;