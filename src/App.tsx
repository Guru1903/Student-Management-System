
import { useReducer, useState, useRef } from 'react'

type Page = 'dashboard' | 'students' | 'addStudents'

type PageAction = {
  pageType: Page
}

type Courses = 'React' | 'Angular' | '.Net'

interface StudentsData {
  id: number
  name: string
  age: number
  course: Courses
}

function setCurrentPage(
  _currentPage: Page,
  action: PageAction
): Page {
  return action.pageType
}

function isCourse(value: string): value is Courses {
  return ['React', 'Angular', '.Net'].includes(value)
}

function App() {
  const [students, setStudents] = useState<StudentsData[]>([
    { id: 1, name: 'Arun', age: 22, course: 'React' },
    { id: 2, name: 'Priya', age: 21, course: 'Angular' },
  ])

  const [currentPage, dispatch] = useReducer(
    setCurrentPage,
    'dashboard'
  )

  const [edit, setEdit] = useState(false)
  const [stuId, setStuId] = useState<number | null>(null)

  const studentName = useRef<HTMLInputElement>(null)
  const studentAge = useRef<HTMLInputElement>(null)
  const studentCourse = useRef<HTMLSelectElement>(null)

  const editStudentName = useRef<HTMLInputElement>(null)
  const editStudentAge = useRef<HTMLInputElement>(null)
  const editStudentCourse = useRef<HTMLSelectElement>(null)

  const selectedStudent = students.find(
    student => student.id === stuId
  )

  function addStudents() {
    const name = studentName.current?.value.trim() ?? ''
    const age = studentAge.current?.value ?? ''
    const course = studentCourse.current?.value ?? ''

    if (!name || !age || !course || !isCourse(course)) {
      alert('Please fill in all fields correctly.')
      return
    }

    const numericAge = Number(age)

    if (!Number.isInteger(numericAge) || numericAge <= 0) {
      alert('Please enter a valid age.')
      return
    }

    setStudents(previousStudents => [
      ...previousStudents,
      {
        id: Math.max(0, ...previousStudents.map(s => s.id)) + 1,
        name,
        age: numericAge,
        course,
      },
    ])

    if (studentName.current) studentName.current.value = ''
    if (studentAge.current) studentAge.current.value = ''
    if (studentCourse.current) studentCourse.current.value = ''
  }

  function deleteStudent(id: number) {
    setStudents(previousStudents =>
      previousStudents.filter(student => student.id !== id)
    )

    if (stuId === id) {
      setEdit(false)
      setStuId(null)
    }
  }

  function editStudent(id: number) {
    setStuId(id)
    setEdit(true)
  }

  function saveEditedStudent() {
    const name = editStudentName.current?.value.trim() ?? ''
    const age = editStudentAge.current?.value ?? ''
    const course = editStudentCourse.current?.value ?? ''

    if (!name || !age || !course || !isCourse(course)) {
      alert('Please fill in all fields correctly.')
      return
    }

    const numericAge = Number(age)

    if (!Number.isInteger(numericAge) || numericAge <= 0) {
      alert('Please enter a valid age.')
      return
    }

    setStudents(previousStudents =>
      previousStudents.map(student =>
        student.id === stuId
          ? {
              ...student,
              name,
              age: numericAge,
              course,
            }
          : student
      )
    )

    setEdit(false)
    setStuId(null)
  }

  function navigate(page: Page) {
    dispatch({ pageType: page })
    setEdit(false)
    setStuId(null)
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <div>
            <span className="navbar-brand fw-bold text-primary">
              <i className="bi bi-mortarboard-fill me-2"></i>
              Student Management
            </span>
            <div className="small text-secondary">
              Manage your students effectively
            </div>
          </div>

          <div className="text-end">
            <div className="small text-secondary">
              Students registered
            </div>
            <span className="badge text-bg-primary fs-6">
              {students.length}
            </span>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-3 px-lg-4 py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <aside className="col-12 col-lg-3 col-xl-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-2">
                <div className="text-uppercase small text-secondary fw-bold px-3 py-2">
                  Navigation
                </div>

                <div className="nav nav-pills flex-column gap-1">
                  <button
                    className={`nav-link text-start ${
                      currentPage === 'dashboard'
                        ? 'active'
                        : 'text-dark'
                    }`}
                    onClick={() => navigate('dashboard')}
                  >
                    <i className="bi bi-grid me-2"></i>
                    Dashboard
                  </button>

                  <button
                    className={`nav-link text-start ${
                      currentPage === 'students'
                        ? 'active'
                        : 'text-dark'
                    }`}
                    onClick={() => navigate('students')}
                  >
                    <i className="bi bi-people me-2"></i>
                    Students
                  </button>

                  <button
                    className={`nav-link text-start ${
                      currentPage === 'addStudents'
                        ? 'active'
                        : 'text-dark'
                    }`}
                    onClick={() => navigate('addStudents')}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-12 col-lg-9 col-xl-10">
            <div className="mb-4">
              <h2 className="fw-bold mb-1">
                {currentPage === 'dashboard'
                  ? 'Dashboard'
                  : currentPage === 'students'
                  ? 'Students'
                  : 'Add Student'}
              </h2>

              <p className="text-secondary mb-0">
                Welcome back! Manage your student records here.
              </p>
            </div>

            {/* Dashboard */}
            {currentPage === 'dashboard' && (
              <>
                <div className="card border-0 shadow-sm text-white bg-primary mb-4">
                  <div className="card-body p-4">
                    <h3 className="fw-bold">Welcome back!</h3>
                    <p className="mb-0">
                      Keep track of students and their enrolled courses.
                    </p>
                  </div>
                  <div className="">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary mb-2">
                          Total Students
                          <i className="bi p-3 bi-people fs-6 text-primary"></i>

                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <h2 className="fw-bold mb-0">
                            {students.length}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="row g-3">
                  <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary mb-2">
                          React Students
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="fw-bold mb-0">
                            {students.filter(s => s.course === 'React').length}
                          </h2>
                          <i className="bi bi-code-slash fs-2 text-success"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary mb-2">
                          Dot Net Students
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="fw-bold mb-0">
                            {students.filter(s => s.course === '.Net').length}
                          </h2>
                          <i className="bi bi-arrow-down fs-2 text-success"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary mb-2">
                          Angular Students
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="fw-bold mb-0">
                            {students.filter(s => s.course === 'Angular').length}
                          </h2>
                          <i className="bi bi-window fs-2 text-warning"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                

                

                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Recent Students</h5>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Course</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(-5).map(student => (
                          <tr key={student.id}>
                            <td>{student.id}</td>
                            <td className="fw-semibold">{student.name}</td>
                            <td>{student.age}</td>
                            <td>
                              <span className="badge text-bg-info">
                                {student.course}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Students table */}
            {currentPage === 'students' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">All Students</h5>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('addStudents')}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Add Student
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Course</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td className="fw-semibold">{student.name}</td>
                          <td>{student.age}</td>
                          <td>
                            <span className="badge text-bg-info">
                              {student.course}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => editStudent(student.id)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteStudent(student.id)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {students.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-5 text-secondary">
                            No students found. Add your first student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Student form */}
            {currentPage === 'addStudents' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Add New Student</h5>
                </div>

                <div className="card-body p-4">
                  <div className="mb-3">
                    <label className="form-label">Student Name</label>
                    <input
                      ref={studentName}
                      type="text"
                      className="form-control"
                      placeholder="Enter student name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      ref={studentAge}
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter student age"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Course</label>
                    <select
                      ref={studentCourse}
                      className="form-select"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a course
                      </option>
                      <option value="React">React</option>
                      <option value="Angular">Angular</option>
                      <option value=".Net">.NET</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={addStudents}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Add Student
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('students')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Student form */}
            {currentPage === 'students' && edit && (
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Edit Student</h5>
                </div>

                <div className="card-body p-4">
                  {selectedStudent ? (
                    <form
                      onSubmit={event => {
                        event.preventDefault()
                        saveEditedStudent()
                      }}
                    >
                      <div className="mb-3">
                        <label className="form-label">Student Name</label>
                        <input
                          key={`name-${stuId}`}
                          ref={editStudentName}
                          type="text"
                          className="form-control"
                          defaultValue={selectedStudent.name}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input
                          key={`age-${stuId}`}
                          ref={editStudentAge}
                          type="number"
                          min="1"
                          className="form-control"
                          defaultValue={selectedStudent.age}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Course</label>
                        <select
                          key={`course-${stuId}`}
                          ref={editStudentCourse}
                          className="form-select"
                          defaultValue={selectedStudent.course}
                          required
                        >
                          <option value="React">React</option>
                          <option value="Angular">Angular</option>
                          <option value=".Net">.NET</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-primary me-2">
                        <i className="bi bi-check-lg me-1"></i>
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEdit(false)
                          setStuId(null)
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <p className="text-secondary mb-0">
                      This student could not be found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
