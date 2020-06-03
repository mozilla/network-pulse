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

const SIGN_UP_PARAM = `sign_up`;
const EDIT_NEW_PROFILE_PARAM = `edit_new_profile`;

class JoinUsModal extends React.Component {
  constructor(props) {
    super(props);
    this.totalStep = 3;
    this.state = {
      user: {},
      formValues: {},
      currentStep: 1,
      showModal: false,
      submitting: false,
      showConfirmation: false,
    };
  }

  openModal() {
    this.setState({ showModal: true }, () => {
      // a hack to disable 'email' field
      // because react-formbuilder doesn't allow setting a field as disabled
      try {
        document.querySelector(`input[name='email']`).disabled = true;
      } catch (e) {
        console.error(e);
      }
    });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);

    let query = qs.parse(this.props.location.search.substring(1));

    // send user to sign in/up page
    // and make sure we redirect user back to where he/she was
    if (query[SIGN_UP_PARAM] === `true`) {
      user.login(
        utility
          .getCurrentURL()
          .replace(`${SIGN_UP_PARAM}=true`, `${EDIT_NEW_PROFILE_PARAM}=true`)
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // show profile edit modal
    let query = qs.parse(this.props.location.search.substring(1));
    if (query[EDIT_NEW_PROFILE_PARAM] === `true`) {
      if (
        !prevState.user.loggedin &&
        this.state.user.loggedin &&
        !this.state.showModal
      ) {
        this.loadProfileToForm(() => this.openModal());
      }
    }
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified`) {
      this.setState({ user });
    }
  }

  loadProfileToForm(done) {
    // get current profile data and load it into form
    Service.myProfile.get().then((profile) => {
      this.setState({ fields: createFields(this.state.user, profile) }, () =>
        done()
      );
    });
  }

  handleFormUpdate(evt, name, field, value) {
    let formValues = this.state.formValues;

    // if value of an image field is a link, we don't wanna include it in the formValues state
    // as the link is just for previewing user's current profile and not the image object we are
    // sending to backend
    if (
      field.type !== `image` ||
      (field.type === `image` && typeof value !== `string`)
    ) {
      formValues[name] = value;
      this.setState({ formValues });
    }
  }

  handleFormSubmit() {
    this.setState(
      {
        submitting: true,
      },
      () => {
        let formValues = this.state.formValues;
        delete formValues[`email`]; // exclude email from data posting to API as email shouldn't be changeable

        this.updateProfile(formValues);
      }
    );
  }

  updateProfile(formValues) {
    Service.myProfile
      .put(formValues)
      .then(() => {
        this.setState({ showConfirmation: true });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  getNextScreenState() {
    return this.state.currentStep < this.totalStep
      ? { currentStep: this.state.currentStep + 1 }
      : {};
  }

  handleNextBtnClick() {
    // validate current form section
    this.refs[`step${this.state.currentStep}Form`].validates((valid) => {
      if (valid) {
        if (this.state.currentStep === this.totalStep) {
          // we've reached the last step of the form, submit the form
          this.handleFormSubmit();
        } else {
          // more steps to complete
          this.setState(this.getNextScreenState());
        }
      }
    });
  }

  handleSkipBtnClick() {
    let currentStep = this.state.currentStep;
    let formValues = this.state.formValues;
    let fieldsToReset = this.state.fields[`step${this.state.currentStep}`];

    Object.keys(fieldsToReset).forEach((key) => {
      delete formValues[key];
    });

    this.setState(
      Object.assign({ formValues }, this.getNextScreenState()),
      () => {
        if (currentStep === this.totalStep) {
          this.handleFormSubmit();
        }
      }
    );
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
          heading="Complete your profile"
          subhead="Please confirm your information to finish creating your profile."
          hint="(This information came from your Google or GitHub account)"
        >
          <Form
            ref="step1Form"
            fields={this.state.fields[`step1`]}
            inlineErrors={true}
            onUpdate={(evt, name, field, value) =>
              this.handleFormUpdate(evt, name, field, value)
            }
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
              this.handleFormUpdate(evt, name, field, value)
            }
          />
        </Step>
        <Step show={this.state.currentStep === 3} heading="Add a profile photo">
          <Form
            ref="step3Form"
            fields={this.state.fields[`step3`]}
            inlineErrors={true}
            onUpdate={(evt, name, field, value) =>
              this.handleFormUpdate(evt, name, field, value)
            }
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
        <button
          className="btn btn-secondary"
          onClick={() => this.handleNextBtnClick()}
          disabled={this.state.submitting ? `disabled` : null}
        >
          Continue
        </button>
      </div>
    );

    let secondaryAction = this.state.currentStep !== 1 && (
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
          <div className="secondary-action mt-4">{secondaryAction}</div>
        </div>
      </div>
    );
  }

  renderModalContent() {
    if (this.state.showConfirmation) {
      return this.renderConfirmation();
    }

    return (
      <div>
        {this.renderProgressDots()}
        {this.renderSteps()}
      </div>
    );
  }

  render() {
    if (!this.state.showModal) return null;

    return (
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={() => this.closeModal()}
        shouldCloseOnOverlayClick={false}
        className="join-us-modal"
        overlayClassName="join-us-modal-overlay"
      >
        <button className="btn btn-close" onClick={() => this.closeModal()}>
          <span className="sr-only">Close modal</span>
        </button>
        {this.renderModalContent()}
        {this.renderButtons()}
      </Modal>
    );
  }
}

export default JoinUsModal;
