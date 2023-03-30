import { useState, useEffect, useCallback } from 'react'
import { BiCalendar } from "react-icons/bi"
import Search from "./components/Search"
import AddAppointment from "./components/AddAppointment"
import AppointmentInfo from "./components/AppointmentInfo"

function App() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName"); // Value appointment list is sorted by (petname, date etc)
  const [orderBy, setOrderBy] = useState("asc"); // Asecnding or descending order
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const filteredAppointments = appointmentList.filter(item => {
    return item["petName"].toLowerCase().includes(query.toLowerCase())    ||
           item["ownerName"].toLowerCase().includes(query.toLowerCase())  ||
           item["aptNotes"].toLowerCase().includes(query.toLowerCase())
  }).sort((a, b) => {
    let order = (orderBy === "asc") ? -1 : 1; // If asc, a => b => c and desc, c => b => a
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() 
      ? 1 * order : -1 * order // If asc, return -1 so a goes before b if smaller and vice versa if desc by return 1
    )
  })

  const addAppointment = (newAppointment) => {
    setAppointmentList([...appointmentList, newAppointment]);
  }

  const deleteAppointment = (appointmentId) => {
    setAppointmentList((prevList) => {
      return prevList.filter(appointment => appointment.id !== appointmentId)
    })
  } 

  const getLastId = () => {
    return appointmentList.reduce((acc, curr) => {
      return Number(curr.id) > acc ? Number(curr.id) : acc
    }, 0)
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("./data.json")
    .then(res => res.json())
    .then(data => setAppointmentList(data))
    .then(() => setLoading(false))
    .catch(err => setError(err))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" />Your Appointments</h1>
      <AddAppointment
        addAppointment={addAppointment}
        lastId={getLastId}
      />
      <Search 
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      {!loading && <ul className="divide-y divide-gray-200">
        {filteredAppointments.map(appointment => (
            <AppointmentInfo 
              key={appointment.id}
              appointment={appointment}
              deleteAppointment={() => deleteAppointment(appointment.id)}
            />
          ))
        }
      </ul>}
    </div>
  );
}

export default App;
