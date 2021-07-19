<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="gray-dark">
      <div class="container">
        <b-navbar-brand to="/">
          上場企業ランキング
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/companies">
              企業
            </b-nav-item>
            <b-nav-item to="/">
              業界
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search" />
              <b-button size="sm" variant="light" class="my-2 my-sm-0" type="submit">
                検索する
              </b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>
