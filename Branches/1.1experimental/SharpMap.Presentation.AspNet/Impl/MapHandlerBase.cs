﻿
/*
 *	This file is part of SharpMap.Presentation.AspNet
 *  SharpMap.Presentation.AspNet is free software © 2008 Newgrove Consultants Limited, 
 *  http://www.newgrove.com; you can redistribute it and/or modify it under the terms 
 *  of the current GNU Lesser General Public License (LGPL) as published by and 
 *  available from the Free Software Foundation, Inc., 
 *  59 Temple Place, Suite 330, Boston, MA 02111-1307 USA: http://fsf.org/    
 *  This program is distributed without any warranty; 
 *  without even the implied warranty of merchantability or fitness for purpose.  
 *  See the GNU Lesser General Public License for the full details. 
 *  
 *  Author: John Diss 2008
 * 
 */


using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Web;

namespace SharpMap.Presentation.AspNet.Impl
{
    public abstract class MapHandlerBase<TWebMap, TOutput, TMapRequestConfig>
        : IMapHandler<TWebMap, TOutput, TMapRequestConfig>, IHttpHandler
        where TWebMap : class, IWebMap<TMapRequestConfig, TOutput>
        where TMapRequestConfig : IMapRequestConfig
    {
        #region IMapHandler<TWebMapRenderer,TMapRequestConfig,TMapRenderWrapper,TMapRenderObject> Members

        private TWebMap _webmap;
        public TWebMap WebMap
        {
            get
            {
                EnsureWebMap();
                return _webmap;
            }
        }

        private void EnsureWebMap()
        {
            if (_webmap == null)
                _webmap = CreateWebMap();
        }

        public abstract TWebMap CreateWebMap();

        private HttpContext _context;
        public HttpContext Context
        {
            get
            {
                return _context;
            }
        }

        public virtual void ProcessRequest(System.Web.HttpContext context)
        {
            _context = context;

            context.Response.Clear();
            string mime;
            using (TWebMap myRenderer = WebMap)
            {
                using (Stream s = myRenderer.Render(out mime))
                {
                    context.Response.ContentType = mime;

                    s.Position = 0;
                    using (BinaryReader br = new BinaryReader(s))
                    {
                        using (Stream outStream = context.Response.OutputStream)
                        {
                            outStream.Write(br.ReadBytes((int)s.Length), 0, (int)s.Length);
                        }
                    }
                }
            }
            _webmap = null;
            _context = null;
        }

        #endregion

        #region IHttpHandler Members

        public bool IsReusable
        {
            get { return true; }
        }

        #endregion
    }
}
