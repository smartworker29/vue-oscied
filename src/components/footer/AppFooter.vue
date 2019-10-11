<template>
  <footer class="footer">
    <span>2019 &copy; CCR3i All Rights Reserved.</span>
    <ul>
      <li><a>Privacy Policy</a></li>
      <li>|</li>
      <li><a>Data Policy</a></li>
    </ul>
  </footer>
</template>

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

  .account-page + .footer,
  .auth-container-wrapper + .footer {
    color: #fff;
    li {
      color: #fff;
    }
  }
</style>
