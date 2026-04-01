import Header from '../components/Header'
import Footer from '../components/Footer'

const AdminRequired = ({ navigate }) => {
  return (
    <>
      <Header currentPage="admin-required" navigate={navigate} />
      <main className="admin-required-container">
        <h1>Admin Required</h1>
      </main>
      <Footer />
    </>
  )
}

export default AdminRequired