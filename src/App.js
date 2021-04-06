import React, { useEffect, useState } from "react";
import "./styles.css";

import Logo from "./Logo";
import gql from "graphql-tag";
import request from "./utils/request";

export default function App() {

  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState([]);

  const fetchShips = async () => {
    const response = await request(gql`
      {
        ships {
          name
          home_port
          image
          roles
        }
      }
    `);

    // console.log(response.data);
    setList(response.data.ships);
    // console.log(list);


  };



  useEffect(() => {
    fetchShips();
  }, [list]);


  useEffect(() => {
    setFilterData(
      list.filter((val) =>
        val.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, list]);



  return (
    
    <div className="App">


<Logo />

      <div className="search-box">
        <input type="text" placeholder="Search Ships...." align="left"
          onChange={event => { setSearch(event.target.value) }} />
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>

      <div className="count">TOTAL COUNT : {filterData.length}</div>

      {filterData.map((val, key) => {
        return (

          <div className="body" key={key}>

            <img src={val.image} />

            <div className="row">

              <div className="left">
                <p>{val.name}</p>
              </div>
              <div className="right">
                <p>PORT : {val.home_port}</p>
                <p>ROLES : {val.roles[0]}</p>
              </div>
            </div>

          </div>
        );
      })}


    </div>
  );


}
