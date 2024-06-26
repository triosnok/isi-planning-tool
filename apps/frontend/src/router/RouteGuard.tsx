import { useProfile, useRefreshTokenQuery } from '@/features/auth/api';
import { useTranslations } from '@/features/i18n';
import { AuthStatus } from '@/lib/constants';
import { Navigate } from '@solidjs/router';
import {
  Component,
  JSX,
  Match,
  Switch,
  createEffect,
  createMemo,
} from 'solid-js';
import { RouteAuthentication } from '.';

interface RouteGuardProps {
  authentication: RouteAuthentication;
  children: JSX.Element;
}

const RouteGuard: Component<RouteGuardProps> = (props) => {
  const profileQuery = useProfile();
  const guard = props.authentication;
  const { t } = useTranslations();
  useRefreshTokenQuery(); // causes token refreshes to happen in the background

  const auth = createMemo(() => {
    const data = profileQuery.data;

    const isAuthenticated = data !== undefined && data !== null;
    const isAuthorized =
      guard.status === AuthStatus.SIGNED_OUT ||
      (isAuthenticated &&
        (guard.roles === undefined || guard.roles.includes(data.role)));

    return {
      isAuthenticated,
      isAuthorized,
    };
  });

  return (
    <Switch>
      <Match when={profileQuery.isPending}>{t('FEEDBACK.LOADING')}</Match>

      <Match
        when={guard.status === AuthStatus.SIGNED_OUT && auth().isAuthenticated}
      >
        <Navigate href='/projects' />
      </Match>

      <Match
        when={guard.status === AuthStatus.SIGNED_IN && !auth().isAuthenticated}
      >
        <Navigate href='/sign-in' />
      </Match>

      <Match when={!auth().isAuthorized}>
        <Navigate href='/projects' />
      </Match>

      <Match when={auth().isAuthorized}>{props.children}</Match>
    </Switch>
  );
};

export default RouteGuard;
