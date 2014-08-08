Sandbox = require 'rxmarbles/views/sandbox'
OperatorsMenu = require 'rxmarbles/views/operators-menu'

sandboxContainer = document.querySelector(".sandbox")
sandboxContainer.appendChild(Sandbox.render())

operatorsMenuContainer = document.querySelector(".operators-menu-container")
operatorsMenuContainer.appendChild(OperatorsMenu.render())
