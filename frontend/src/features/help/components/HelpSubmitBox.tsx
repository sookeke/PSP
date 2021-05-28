import './HelpSubmitBox.scss';

import * as React from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

import { helpTickets, TicketTypes } from '../constants/HelpText';

interface IHelpSubmitBoxProps {
  /** the keycloak user display name */
  user: string;
  /** the keycloak user email */
  email: string;
  /** set the active ticket type */
  setActiveTicketType: Function;
  /** the active ticket type, determines which form fields to display to the user. */
  activeTicketType: TicketTypes;
  /** the name of the current page, used to provide context in the email generated by the ticket form. ie. Landing Page. */
  page: string;
  /** set the mailto of the parent based on the ticket form content. */
  setMailto: Function;
}

/**
 * A component that displays a list of Help Ticket types as well as a form corresponding to the active Help Ticket type
 */
const HelpSubmitBox: React.FunctionComponent<IHelpSubmitBoxProps> = ({
  setActiveTicketType,
  activeTicketType,
  setMailto,
  ...rest
}) => {
  const form = helpTickets.get(activeTicketType);
  return (
    <FormPicker className="help-submit-box">
      <span className="col-md-4">
        {Object.values(TicketTypes).map((ticket: string) => (
          <Form.Check
            type="radio"
            id={`ticket-${ticket}`}
            key={`ticket-${ticket}`}
            label={ticket}
            onChange={() => setActiveTicketType(ticket)}
            checked={ticket === activeTicketType}
          />
        ))}
      </span>
      <span className="col-md-8">
        {form &&
          form({
            formValues: rest,
            setMailto: setMailto,
          })}
      </span>
    </FormPicker>
  );
};

const FormPicker = styled.div`
  display: flex;
`;

export default HelpSubmitBox;
