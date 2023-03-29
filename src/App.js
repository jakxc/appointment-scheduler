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

  const filteredAppointments = appointmentList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order : 1 * order
    )
  })

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
        onSendAppointment={newAppointment => setAppointmentList([...appointmentList, newAppointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search 
        query={query}
        onQueryChange={myQuery => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={mySort => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
      />

      {!loading && <ul className="divide-y divide-gray-200">
        {filteredAppointments.map(appointment => (
            <AppointmentInfo 
              key={appointment.id}
              appointment={appointment}
              onDeleteAppointment={(appointmentId) => setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId))}
            />
          ))
        }
      </ul>}
    </div>
  );
}

export default App;
