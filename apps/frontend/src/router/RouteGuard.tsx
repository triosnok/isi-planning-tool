import { useProfile } from '@/features/auth/api';
import { AuthStatus, Role } from '@/lib/constants';
import { Navigate } from '@solidjs/router';
import { Component, JSX, Match, Switch, createMemo } from 'solid-js';

interface RouteGuardProps {
  roles?: Role[];
  authStatus: AuthStatus;
  children: JSX.Element;
}

const RouteGuard: Component<RouteGuardProps> = (props) => {
  const profileQuery = useProfile();

  const profile = createMemo(() => {
    const isAuthenticated = profileQuery.data !== undefined;
    const role = profileQuery.data?.role;

    return {
      isAuthenticated,
      role,
    };
  });

  return (
    <Switch fallback={props.children}>
      <Match when={profileQuery.isLoading}>loading...</Match>
      <Match
        when={
          props.authStatus === AuthStatus.SIGNED_OUT &&
          profile().isAuthenticated
        }
      >
        <Navigate href='/' />
      </Match>
      <Match
        when={
          props.authStatus === AuthStatus.SIGNED_IN &&
          !profile().isAuthenticated
        }
      >
        <Navigate href='/sign-in' />
      </Match>
    </Switch>
  );
};

export default RouteGuard;
