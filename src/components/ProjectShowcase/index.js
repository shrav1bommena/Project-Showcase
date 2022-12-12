/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const initialCategoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowcase extends Component {
  state = {
    categoriesList: initialCategoriesList,
    activeCategory: initialCategoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        projectsList: data.projects,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsData)
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProjectList = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list">
        {projectsList.map(eachProject => (
          <li className="project-item" key={eachProject.id}>
            <img
              className="project-logo"
              src={eachProject.image_url}
              alt={eachProject.name}
            />
            <div className="project-name">
              <p>{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.getProjectsData} type="button">
        Retry
      </button>
    </div>
  )

  renderDataByApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectList()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  renderNavbar = () => (
    <nav className="nav-bar">
      <img
        className="nav-bar-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
      />
    </nav>
  )

  renderOptionsList = () => {
    const {categoriesList, activeCategory} = this.state

    return (
      <select
        className="select-options"
        onChange={this.changeCategory}
        value={activeCategory}
      >
        {categoriesList.map(eachCategory => (
          <option key={eachCategory.id} value={eachCategory.id}>
            {eachCategory.displayText}
          </option>
        ))}
      </select>
    )
  }

  render() {
    return (
      <div>
        {this.renderNavbar()}
        <div className="body-div">
          {this.renderOptionsList()}
          {this.renderDataByApiStatus()}
        </div>
      </div>
    )
  }
}

export default ProjectShowcase
