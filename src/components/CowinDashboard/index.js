// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusConstants.initial, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    this.setState({
      apiStatus: apiStatusConstants.inprogress,
    })
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      //  console.log(fetchedData)
      const updatedData = {
        last7DaysVaccinationDetails: fetchedData.last_7_days_vaccination.map(
          eachItem => ({
            vaccineDate: eachItem.vaccine_date,
            dose1: eachItem.dose_1,
            dose2: eachItem.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            count: genderType.count,
            gender: genderType.gender,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  apiStatusSuccessView = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={
            vaccinationData.last7DaysVaccinationDetails
          }
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />

        <VaccinationByAge
          vaccinationAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  inProgressLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="white" height={50} width={50} />
    </div>
  )

  vaccinationAllDataResponses = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.apiStatusSuccessView()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inprogress:
        return this.inProgressLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowindashboard-main-container">
        <div className="cowindashboard-sub-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo-img"
            />
            <h1 className="cowin-head">Co-Win</h1>
          </div>
          <h1 className="cowin-card-head">CoWin Vaccination In India</h1>
          {this.vaccinationAllDataResponses()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
