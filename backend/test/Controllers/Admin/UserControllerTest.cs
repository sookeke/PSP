using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Dal;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using Pims.Dal.Services;
using AutoMapper;
using Pims.Api.Test.Helpers;
using Pims.Api.Models;
using Pims.Dal.Services.Admin;
using Pims.Dal.Entities;

namespace PimsApi.Test.Admin.Controllers
{
    public class UserControllerTest
    {
        #region Variables
        private readonly UserController _userController;
        private readonly TestHelper _helper;
        private readonly IMapper _mapper;
        private static readonly int AGENCY_ID = 2;
        private static readonly Guid ROLE_ID = Guid.NewGuid();
        private static readonly Guid USER_ID = Guid.NewGuid();
        private static readonly Guid ACCCESS_REQUEST_ID = Guid.NewGuid();
        private readonly Mock<IPimsAdminService> _pimsService;
        private readonly Entity.AccessRequest _expectedAccessRequest = new Entity.AccessRequest()
        {
            Id = ACCCESS_REQUEST_ID,
            Agencies = new Entity.AccessRequestAgency[]
            {
                new Entity.AccessRequestAgency
                {
                    AgencyId = AGENCY_ID,
                    AccessRequestId = ACCCESS_REQUEST_ID
                }
            },
            UserId = USER_ID,
            User = new Entity.User
            {
                Id = USER_ID,
                DisplayName = "TEST",
                Email = "test@test.ca"
            },
            Roles = new Entity.AccessRequestRole[]
            {
                new Entity.AccessRequestRole
                {
                    RoleId = ROLE_ID,
                    AccessRequestId = ACCCESS_REQUEST_ID
                }
            }
        };

        #endregion

        #region Constructors
        public UserControllerTest()
        {
            var user = PrincipalHelper.CreateForRole("contributor");
            _helper = new TestHelper();
            _helper.CreatePimsAdminService();
            _userController = _helper.CreateAdminUserController(user);
            _mapper = _helper.GetService<IMapper>();
            _pimsService = _helper.GetService<Mock<IPimsAdminService>>();
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void GetAccessRequests()
        {
            var expectedAccessRequests = new Entity.AccessRequest[] { _expectedAccessRequest };
            var expectedPagedAccessRequests = new Pims.Dal.Entities.Models.Paged<AccessRequest>(expectedAccessRequests);
            _pimsService.Setup(m => m.User.GetAccessRequestsNoTracking(1, 10, null, null)).Returns(expectedPagedAccessRequests);
            var result = _userController.GetAccessRequests(1, 10, null);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Pims.Dal.Entities.Models.Paged<AccessRequestModel> actualAccessRequest = Assert.IsType<Pims.Dal.Entities.Models.Paged<AccessRequestModel>>(actionResult.Value);
            Assert.Equal(_mapper.Map<Model.AccessRequestModel[]>(expectedAccessRequests), actualAccessRequest.Items);
        }
        #endregion

        #endregion
    }
}
