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
    color: #fff;
    font-size: 14px;
    display: inline-flex;
    position: absolute;
    bottom: 22px;
    width: 100%;
    @media only screen and (max-width: 768px) {
      justify-content: center;
      left: 0;
    }
    span {
      margin-right: 26px;
    }
    ul {
      display: flex;
    }
    li {
      a {
        text-decoration: underline;
      }
      margin-right: 6px;
    }
  }
</style>
