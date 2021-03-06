using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Comparers;
using Pims.Core.Http;
using Pims.Core.Http.Configuration;
using Pims.Core.Test;
using Pims.Dal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Models.User;

namespace PimsApi.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "user")]
    [ExcludeFromCodeCoverage]
    public class UserControllerTest
    {
        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
        #region UserInfo
        [Fact]
        public async Task UserInfo_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var options = new Pims.Keycloak.Configuration.KeycloakOptions()
            {
                Authority = "test",
                Audience = "test",
                Client = "test",
                OpenIdConnect = new OpenIdConnectOptions()
                {
                    Token = "test",
                    UserInfo = "test"
                }
            };
            var optionsMonitor = new Mock<IOptionsMonitor<Pims.Keycloak.Configuration.KeycloakOptions>>();
            optionsMonitor.Setup(m => m.CurrentValue).Returns(options);
            var controller = helper.CreateController<UserController>(user, optionsMonitor.Object);

            var service = helper.GetService<Mock<IProxyRequestClient>>();
            var model = new KModel.UserInfoModel()
            {
                Id = Guid.NewGuid()
            };
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(model))
            };
            service.Setup(m => m.ProxyGetAsync(It.IsAny<HttpRequest>(), It.IsAny<string>())).Returns(Task.FromResult(response));

            // Act
            var result = await controller.UserInfoAsync();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<KModel.UserInfoModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            service.Verify(m => m.ProxyGetAsync(It.IsAny<HttpRequest>(), It.IsAny<string>()), Times.Once());
        }
        #endregion

        #region GetAccessRequest
        [Fact]
        public void GetAccessRequest_Current_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var accessRequest = EntityHelper.CreateAccessRequest();
            service.Setup(m => m.User.GetAccessRequest()).Returns(accessRequest);
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = controller.GetAccessRequest();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            Assert.Equal(model.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(model.Roles, actualResult.Roles, new DeepPropertyCompare());
            Assert.Equal(model.User.Id, actualResult.User.Id);
            service.Verify(m => m.User.GetAccessRequest(), Times.Once());
        }

        [Fact]
        public void GetAccessRequest_Current_NoContent()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            service.Setup(m => m.User.GetAccessRequest());

            // Act
            var result = controller.GetAccessRequest();

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            service.Verify(m => m.User.GetAccessRequest(), Times.Once());
        }

        [Fact]
        public void GetAccessRequest_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var accessRequest = EntityHelper.CreateAccessRequest();
            service.Setup(m => m.User.GetAccessRequest(It.IsAny<int>())).Returns(accessRequest);
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = controller.GetAccessRequest(1);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            Assert.Equal(model.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(model.Roles, actualResult.Roles, new DeepPropertyCompare());
            Assert.Equal(model.User.Id, actualResult.User.Id);
            service.Verify(m => m.User.GetAccessRequest(1), Times.Once());
        }
        #endregion

        #region AddAccessRequest
        [Fact]
        public async void AddAccessRequest_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = EntityHelper.CreateAccessRequest();
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = await controller.AddAccessRequestAsync(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            Assert.Equal(model.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(model.Roles, actualResult.Roles, new DeepPropertyCompare());
            Assert.Equal(model.User.Id, actualResult.User.Id);
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Once());
        }

        [Fact]
        public async void AddAccessRequestAsync_Null_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            // Act
            // Assert
            await Assert.ThrowsAsync<BadRequestException>(async () => await controller.AddAccessRequestAsync(null));
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public async void AddAccessRequestAsync_NullAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = null,
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            await Assert.ThrowsAsync<BadRequestException>(async () => await controller.AddAccessRequestAsync(model));
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public async void AddAccessRequestAsync_NullRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(),
                Roles = null
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            await Assert.ThrowsAsync<BadRequestException>(async () => await controller.AddAccessRequestAsync(model));
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public async void AddAccessRequestAsync_InvalidRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(new[] { new Model.AccessRequestAgencyModel() }),
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            await Assert.ThrowsAsync<BadRequestException>(async () => await controller.AddAccessRequestAsync(model));
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public async void AddAccessRequestAsync_InvalidAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(),
                Roles = new List<Model.AccessRequestRoleModel>(new[] { new Model.AccessRequestRoleModel() })
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            await Assert.ThrowsAsync<BadRequestException>(async () => await controller.AddAccessRequestAsync(model));
            service.Verify(m => m.User.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }
        #endregion

        #region UpdateAccessRequest
        [Fact]
        public void UpdateAccessRequest_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = EntityHelper.CreateAccessRequest();
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = controller.UpdateAccessRequest(model.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            Assert.Equal(model.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(model.Roles, actualResult.Roles, new DeepPropertyCompare());
            Assert.Equal(model.User.Id, actualResult.User.Id);
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Once());
        }

        [Fact]
        public void UpdateAccessRequest_Null_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.UpdateAccessRequest(1, null));
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void UpdateAccessRequest_NullAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = null,
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.UpdateAccessRequest(model.Id, model));
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void UpdateAccessRequest_NullRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(),
                Roles = null
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.UpdateAccessRequest(model.Id, model));
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void UpdateAccessRequest_InvalidRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(new[] { new Model.AccessRequestAgencyModel() }),
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.UpdateAccessRequest(model.Id, model));
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void UpdateAccessRequest_InvalidAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AccessRequestAgencyModel>(),
                Roles = new List<Model.AccessRequestRoleModel>(new[] { new Model.AccessRequestRoleModel() })
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.UpdateAccessRequest(model.Id, model));
            service.Verify(m => m.User.UpdateAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
