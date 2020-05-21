<template>
  <footer class="footer">
    <span v-html="$t('copy_right', { years: '2019'})"></span>
    <ul>
      <li><a>{{ $t('private_policy') }}</a></li>
      <li>|</li>
      <li><a>{{ $t('data_policy') }}</a></li>
    </ul>
  </footer>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component({ name: 'AppFooter' })
export default class AppFooter extends Vue {}
</script>

<style lang="scss">
  .footer {
    color: #071012;
    left: 5.5%;
    font-size: 14px;
    display: inline-flex;
    position: absolute;
    bottom: 22px;
    @media only screen and (max-width: 768px) {
      justify-content: center;
      left: 0;
      width: 100%;
      padding: 0 5.5%;
      position: static;
      margin-bottom: 40px;
    }

    @media only screen and (max-width: 576px) {
      flex-wrap: wrap;
      text-align: center;
      font-size: 14px;
      span {
        display: block;
        width: 100%;
        margin-right: 0;
        margin-bottom: 5px;
      }
    }
    span {
      margin-right: 26px;
    }
    ul {
      display: flex;
    }
    li {
      color: #3d5a80;
      a {
        cursor: pointer;
        text-decoration: underline;
      }
      margin-right: 6px;
    }
  }

  .survey-completed-page + .footer,
  .survey-completed-page-completed + .footer,
  .account-page + .footer,
  .auth-container-wrapper + .footer {
    color: #fff;
    li {
      color: #fff;
    }
  }
</style>
