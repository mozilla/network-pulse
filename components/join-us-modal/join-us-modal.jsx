/* eslint-disable prettier/prettier */
import React from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { Form } from "react-formbuilder";
import qs from "qs";
import Step from "./step.jsx";
import user from "../../js/app-user";
import utility from "../../js/utility";
import Service from "../../js/service";
import createFields from "./form/create-fields";

Modal.setAppElement("#app");

class JoinUsModal extends React.Component {
  constructor(props) {
    super(props);
    this.totalStep = 3;
    this.state = {
      user,
      formValues: {},
      currentStep: 1,
      submitting: false,
      showModal: false,
      showConfirmation: false,
      modalIsOpen: true
    };
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);

    let query = qs.parse(this.props.location.search.substring(1));

    if (query.sign_up === `true`) {
      user.login(
        utility.getCurrentURL().replace(`sign_up=true`, `edit_new_profile=true`)
      );
    }

    if (query.edit_new_profile === `true`) {
      // TODO:FIXME: do we always show this modal?
      //             or only the first time this user has signed in using the special link
      this.setState({ showModal: true });
    }
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified`) {
      console.log(`verified`, user);
      this.setState(
        {
          user,
          fields: createFields(user)
        },
        () => {
          // hack to set email field as disabled / not editable
          try {
            document.querySelector(`input[name='email']`).disabled = true;
          } catch (e) {

          }
        }
      );
    }
  }

  handleFormUpdate(evt, name, field, value) {
    let formValues = this.state.formValues;

    formValues[name] = value;
    this.setState({
      formValues,
      // hide notice once user starts typing again
      // this is a quick fix. for context see https://github.com/mozilla/network-pulse/pull/560
      showFormInvalidNotice: false
    });
  }

  handleFormSubmit() {
    // TODO:FIXME: delete email from post value
    // TODO:FIXME: deal with these states
    this.setState(
      {
        showFormInvalidNotice: false,
        submitting: true
      },
      () => {
        let formValues = this.state.formValues;
        delete formValues[`email`]; // exclude email from data posting to API as email shouldn't be changeable

        this.updateProfile(formValues);
      }
    );
  }

  updateProfile(profile) {
    Service.myProfile
      .put(profile)
      .then(() => {
        this.setState({ showConfirmation: true });
      })
      .catch(reason => {
        this.setState({
          // TODO:FIXME: do we care to have this state?
          serverError: true
        });
        console.error(reason);
      });
  }

  handlePrevBtnClick() {
    this.setState({
      currentStep: Math.max(this.state.currentStep - 1, 1)
    });
  }

  getNextScreenState() {
    let state = {};

    if (this.state.currentStep === this.totalStep) {
      // TODO:FIXME: do we need this? formsubmit should have this handled?!
      state.showConfirmation = true;
    } else {
      state.currentStep = this.state.currentStep + 1;
    }

    return state;
  }

  handleNextBtnClick() {
    this.refs[`step${this.state.currentStep}Form`].validates(valid => {
      console.log(`current form is valid? ` + valid);

      if (valid) {
        if (this.state.currentStep === this.totalStep) {
          this.handleFormSubmit();
        } else {
          this.setState(this.getNextScreenState(), () => {
            console.log(this.state.formValues);
          });
        }
      }
    });
  }

  handleSkipBtnClick() {
    let currentStep = this.state.currentStep;
    let formValues = this.state.formValues;
    let fieldsToReset = this.state.fields[`step${this.state.currentStep}`];
    Object.keys(fieldsToReset).forEach(key => {
      delete formValues[key];
    });

    this.setState(Object.assign({ formValues }, this.getNextScreenState()), () => {
      if (currentStep === this.totalStep) {
        this.handleFormSubmit();
      }
    });
  }

  renderProgressDots() {
    let dots = [...Array(this.totalStep)].map((dot, i) => {
      return (
        <div
          key={i}
          className={`dot ${this.state.currentStep === i + 1 ? `filled` : ``}`}
        />
      );
    });

    return <div className="modal-progress">{dots}</div>;
  }

  renderSteps() {
    return (
      <div>
        <Step
          show={this.state.currentStep === 1}
          heading="Complete your sign up"
          subhead="Please confirm your information to finish signing up."
          hint="(This information came from your Google or GitHub account)"
        >
          <Form
            ref="step1Form"
            fields={this.state.fields[`step1`]}
            inlineErrors={true}
            onUpdate={(evt, name, field, value) =>
              this.handleFormUpdate(evt, name, field, value)}
          />
        </Step>
        <Step
          show={this.state.currentStep === 2}
          heading="Add a short bio"
          subhead="Tell other Network members a bit about yourself"
        >
          <Form
            ref="step2Form"
            fields={this.state.fields[`step2`]}
            inlineErrors={true}
            onUpdate={(evt, name, field, value) =>
              this.handleFormUpdate(evt, name, field, value)}
          />
        </Step>
        <Step show={this.state.currentStep === 3} heading="Add a profile photo">
          <Form
            ref="step3Form"
            fields={this.state.fields[`step3`]}
            inlineErrors={true}
            onUpdate={(evt, name, field, value) =>
      this.handleFormUpdate(evt, name, field, value)}
          />
        </Step>
      </div>
    );
  }

  renderConfirmation() {
    return (
      <div className="text-center">
        <h2 className="h3-heading">Discover and Connect!</h2>
        <p className="body-large">Thanks for signing up!</p>
        <p>
          Check out projects, connect with other members. Upload your projects
          or add more to your profile.
        </p>
      </div>
    );
  }

  renderButtons() {
    let primaryAction = (
      <div>
        <button onClick={event => this.handlePrevBtnClick(event)}>Back</button>
        <button
          className="btn btn-secondary"
          onClick={() => this.handleNextBtnClick()}
          disabled={this.state.submitting ? `disabled` : null}
        >
          Continue
        </button>
      </div>
    );
    let secondaryAction = (
      <button
        className="btn btn-link inline-link"
        onClick={() => this.handleSkipBtnClick()}
      >
        I'll do this later
      </button>
    );

    if (this.state.showConfirmation) {
      primaryAction = (
        <div>
          <Link
            to="/"
            className="btn btn-primary"
            onClick={() => this.closeModal()}
          >
            Explore
          </Link>
        </div>
      );

      secondaryAction = (
        <Link to="/myprofile" onClick={() => this.closeModal()}>
          Continue editing my profile
        </Link>
      );
    }

    return (
      <div className="text-center mt-5">
        <div className="mt-4">
          {primaryAction}
          <div className="secondary-action mt-5">{secondaryAction}</div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.showModal || !this.state.user.loggedin) return null;

    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={() => this.closeModal()}
        shouldCloseOnOverlayClick={false}
        className="join-us-modal"
        overlayClassName="join-us-modal-overlay"
      >
        <button className="btn btn-close" onClick={() => this.closeModal()}>
          <span className="sr-only">Close modal</span>
        </button>
        {!this.state.showConfirmation && this.renderProgressDots()}
        {!this.state.showConfirmation
          ? this.renderSteps()
          : this.renderConfirmation()}
        {this.renderButtons()}
      </Modal>
    );
  }
}

export default JoinUsModal;
