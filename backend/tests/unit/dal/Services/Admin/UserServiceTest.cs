using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services.Admin
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("area", "admin")]
    [Trait("group", "users")]
    [ExcludeFromCodeCoverage]
    public class UserServiceTest
    {
        #region Data
        public static IEnumerable<object[]> UserFilterData =>
            new List<object[]>
            {
                new object[] { new UserFilter(1, 1, null, "Tester", "ttester", "McTest", "Test", "test@test.com", false, null, null, null), 1 },
                new object[] { new UserFilter() { DisplayName = "ttester" }, 1 },
                new object[] { new UserFilter() { IsDisabled = true }, 0 },
                new object[] { new UserFilter() { Agency = "Test" }, 0 },
            };
        #endregion


        #region Tests
        [Fact]
        public void User_Count()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers);
            var euser = EntityHelper.CreateUser("Tester");
            helper.CreatePimsContext(user, true).AddAndSaveChanges(euser);

            var service = helper.CreateService<UserService>(user);

            // Act
            var result = service.Count();

            // Assert
            Assert.Equal(1, result);
        }
        #region Get
        [Fact]
        public void Get_Users_Paged()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers);
            var euser = EntityHelper.CreateUser("Tester");
            helper.CreatePimsContext(user, true).AddAndSaveChanges(euser);
            var expectedCount = 1;

            var service = helper.CreateService<UserService>(user);

            // Act
            var result = service.Get(1, 1);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Paged<Entity.User>>(result);
            Assert.Equal(expectedCount, result.Items.Count());
        }

        [Fact]
        public void Get_Users_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var service = helper.CreateService<UserService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get());
        }

        [Theory]
        [MemberData(nameof(UserFilterData))]
        public void Get_Users_Filter(UserFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers);
            var euser = EntityHelper.CreateUser("Tester");
            euser.FirstName = "Test";
            euser.LastName = "McTest";
            euser.DisplayName = "ttester";
            euser.Email = "test@test.com";
            euser.IsDisabled = false;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(euser);

            var service = helper.CreateService<UserService>(user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Paged<Entity.User>>(result);
            Assert.Equal(expectedCount, result.Items.Count());
        }

        [Fact]
        public void Get_User_ById()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers);
            var id = Guid.NewGuid();
            var euser = EntityHelper.CreateUser(id, "ttester", "Tester", "McTest");
            helper.CreatePimsContext(user, true).AddAndSaveChanges(euser);

            var service = helper.CreateService<UserService>(user);

            // Act
            var result = service.Get(id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(id, result.Id);
        }
        #endregion
        #region Add
        [Fact]
        public void Add_User()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers, Permissions.SystemAdmin);
            var euser = EntityHelper.CreateUser(Guid.NewGuid(), "ttester", "Tester", "McTest");
            helper.CreatePimsContext(user, true);

            var service = helper.CreateService<UserService>(user);

            // Act
            service.Add(euser);
            var result = service.Get(euser.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("ttester", result.Username);
        }

        [Fact]
        public void Add_User_ThrowIfNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<UserService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.Add(null));
        }

        #endregion
        #region Update
        [Fact]
        public void Update_User_ThrowIfNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<UserService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.Update(null));
        }

        [Fact]
        public void Update_User_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var euser = EntityHelper.CreateUser("Test");

            var service = helper.CreateService<UserService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Update(euser));
        }

        #endregion
        #endregion
    }
}
