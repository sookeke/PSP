import * as actionTypes from 'constants/actionTypes';
import { useQuery } from 'hooks/use-query';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useState } from 'react';
import { Button, Col, Container, Jumbotron, Row, Spinner } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { IGenericNetworkAction } from 'store/slices/network/interfaces';
import { NEW_PIMS_USER } from 'store/slices/users';
import { Logo, useTenant } from 'tenants';

import { LoginStyled } from './LoginStyled';

/**
 * Login component provides information and links for the user to login.
 * @returns Login component.
 */
const Login = () => {
  const { redirect } = useQuery();
  const [showInstruction, setShowInstruction] = useState(false);
  const keyCloakWrapper = useKeycloakWrapper();
  const keycloak = keyCloakWrapper.obj;
  const isIE = usingIE();
  const activated = useAppSelector(
    state => state.network[actionTypes.ADD_ACTIVATE_USER] as IGenericNetworkAction,
  );
  const tenant = useTenant();

  if (!keycloak) {
    return <Spinner animation="border"></Spinner>;
  }
  if (keycloak?.authenticated) {
    if (activated?.status === NEW_PIMS_USER || !keyCloakWrapper?.roles?.length) {
      return <Redirect to={{ pathname: '/access/request' }} />;
    }
    return <Redirect to={redirect || '/mapview'} />;
  }
  if (isIE) {
    return <Redirect to={{ pathname: '/ienotsupported' }} />;
  }

  return (
    <LoginStyled className="login" fluid={true}>
      <Container className="unauth" fluid={true}>
        <Logo withText={true} />
        <Row className="sign-in">
          <Col xs={1} md={3} />
          <Col xs={16} md={6} className="block">
            <h1>{tenant.login.title}</h1>
            <h6>{tenant.login.heading}</h6>
            <p>{tenant.login.body}</p>
            <Button variant="primary" onClick={() => keycloak.login()}>
              Sign In
            </Button>
            <p>Sign into PIMS with your government issued IDIR or with your Business BCeID.</p>
            <Row className="bceid">
              <Button variant="link" onClick={() => setShowInstruction(!showInstruction)}>
                Don't have a Business BCeID?
              </Button>
            </Row>
            <Row>
              {showInstruction && (
                <Jumbotron>
                  <p>
                    1. Search to see if your entity is{' '}
                    <a
                      href="https://www.bceid.ca/directories/whitepages"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      already registered
                    </a>{' '}
                    <FaExternalLinkAlt />
                  </p>
                  <p>
                    If you're not yet registered, <br></br>2.{' '}
                    <a
                      href="https://www.bceid.ca/os/?7169"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register for your Business BCeID
                    </a>{' '}
                    <FaExternalLinkAlt />
                  </p>
                </Jumbotron>
              )}
            </Row>
          </Col>
          <Col xs={1} md={3} />
        </Row>
      </Container>
    </LoginStyled>
  );
};

//check to see if user is using Internet Explorer
//as their browser
const usingIE = () => {
  const userAgent = window.navigator.userAgent;
  const isOldIE = userAgent.indexOf('MSIE '); //tag used for IE 10 or older
  const isIE11 = userAgent.indexOf('Trident/'); //tag used for IE11
  if (isOldIE > 0 || isIE11 > 0) return true;
  return false;
};

export default Login;
