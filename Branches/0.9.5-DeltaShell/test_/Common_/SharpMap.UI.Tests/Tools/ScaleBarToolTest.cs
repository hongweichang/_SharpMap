﻿using DelftTools.TestUtils;
using NUnit.Framework;
using SharpMap.UI.Forms;

namespace SharpMap.UI.Tests.Tools
{
    [TestFixture]
    public class ScaleBarToolTest
    {
        [Test,Category("Windows.Forms")]
        public void ShowMapWithScaleBar()
        {
            MapControl mapControl = new MapControl();
            WindowsFormsTestHelper.ShowModal(mapControl);
        }
    }
}
